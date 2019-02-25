using ChineseDuck.Bot.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.Rest.Model;

// ReSharper disable LoopCanBeConvertedToQuery

namespace ChineseDuck.Bot.Providers
{
    public sealed class PinyinChineseWordParseProvider : IChineseWordParseProvider
    {
        #region Constructors

        public PinyinChineseWordParseProvider(ISyllableColorProvider syllableColorProvider,
            IChinesePinyinConverter chinesePinyinConverter, ISyllablesToStringConverter syllablesToStringConverter)
        {
            _syllableColorProvider = syllableColorProvider;
            _chinesePinyinConverter = chinesePinyinConverter;
            _syllablesToStringConverter = syllablesToStringConverter;
        }

        #endregion

        #region Fields

        public const ushort MaxSyllablesToParse = 15;
        public const char ImportSeparator1 = ';';
        public const char ImportSeparator2 = '；';
        public const char ReplaceSeparator = ',';

        public const string PinyinExludeRegexPattern = "[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]";
        public const string PinyinNumIncludeRegexPattern = "^[a-z0-4]+$";
        public const string PinyinNumExludeRegexPattern = "[^a-z]";

        private readonly ISyllableColorProvider _syllableColorProvider;
        private readonly IChinesePinyinConverter _chinesePinyinConverter;
        private readonly ISyllablesToStringConverter _syllablesToStringConverter;

        #endregion

        #region Methods

        private Syllable GetSyllable(char charWord, string pinyinWithMark)
        {
            return new Syllable(charWord, pinyinWithMark,
                _syllableColorProvider.GetSyllableColor(charWord,
                    _chinesePinyinConverter.ToSyllableNumberTone(pinyinWithMark)));
        }

        private Syllable GetSyllableNumber(char charWord, string pinyinWithNum)
        {
            return new Syllable(charWord, pinyinWithNum,
                _syllableColorProvider.GetSyllableColor(charWord, pinyinWithNum));
        }

        public Syllable[] GetOrderedSyllables(string word)
        {
            return GetOrderedSyllables(word, EToneType.Mark);
        }

        private bool IsChineseCharacter(char character)
        {
            return character >= 0x4e00 && character <= 0x9fbb;
        }

        public Syllable[] GetOrderedSyllables(IWord word)
        {
            var syllableStrings = _syllablesToStringConverter.Parse(word.Pronunciation);
            if (syllableStrings == null)
                return null;

            var syllArray = syllableStrings.ToArray();

            var sylls = new List<Syllable>();
            var chineseOnly = word.OriginalWord.ToArray();

            var chineseCharsCount = 0;

            foreach (var character in chineseOnly)
            {
                var isChineseChar = IsChineseCharacter(character);

                if (isChineseChar)
                {
                    sylls.Add(GetSyllable(character, syllArray[chineseCharsCount]));
                    chineseCharsCount++;
                }
                else
                {
                    sylls.Add(new Syllable(character));
                }
            }
            return sylls.ToArray();
        }

        private bool IsNumbersInPinyinUsed(string pinyin)
        {
            return Regex.IsMatch(pinyin, PinyinNumIncludeRegexPattern);
        }

        /// <summary>
        ///     Строит верный слог для иероглифа и латинского представления слога
        /// </summary>
        /// <param name="chineseChar">Китайский иероглиф, например, 电</param>
        /// <param name="pinyinWithNumber">Представление в латинском алфавите с тоном цифрой, например, dian4</param>
        /// <returns>Верный слог, содержащий латинское представление с тоном сверху, например, diàn</returns>
        public Syllable BuildSyllable(char chineseChar, string pinyinWithNumber)
        {
            var pinyinStringArray = _chinesePinyinConverter.Convert(chineseChar, EToneType.Number);
            if (pinyinStringArray == null || pinyinStringArray.Length == 0)
                return null;

            var rightSyllableIndex = pinyinStringArray
                .TakeWhile(a => a != pinyinWithNumber)
                .Count();

            var outPinyin = _chinesePinyinConverter.Convert(chineseChar, EToneType.Mark)[rightSyllableIndex];

            return GetSyllable(chineseChar, outPinyin);
        }

        /// <summary>
        ///     Формат для импорта слов: Иероглиф[ImportSeparator]Пининь[ImportSeparator]Перевод, либо в случае usePinyin=false
        ///     Иероглиф[ImportSeparator]Перевод.
        ///     Например, 电;diàn;электричество (usePinyin=true, ImportSeparator=";")
        ///     Например, 电;электричество (usePinyin=false, ImportSeparator=";")
        ///     Например, 电;dian4;электричество (usePinyin=true, ImportSeparator=";")
        /// </summary>
        /// <param name="rawWords">Массив строк для импорта</param>
        /// <param name="usePinyin">Флаг, использовать ли пининь из импортируемых строк</param>
        /// <returns>Результат из распознанных и нераспознанных слов</returns>
        public ImportWordResult ImportWords(string[] rawWords, bool usePinyin)
        {
            var goodWords = new List<Word>();
            var badWords = new List<string>();

            foreach (var word in rawWords)
            {
                var arrayToParse = word.Split(new[] {ImportSeparator1, ImportSeparator2},
                    StringSplitOptions.RemoveEmptyEntries);
                if (arrayToParse.Length < 2)
                {
                    badWords.Add(word);
                    continue;
                }

                var mainWord = arrayToParse[0];

                var translationIndex = usePinyin ? 2 : 1;
                var translationNative = string.Join(ImportSeparator1.ToString(), arrayToParse.Skip(translationIndex));

                var syllables = GetOrderedSyllables(mainWord, EToneType.Mark);

                var separatedSyllables = _syllablesToStringConverter.Join(syllables.Select(a => a.Pinyin));

                var solidSyllables = separatedSyllables.Replace(_syllablesToStringConverter.GetSeparator(),
                    string.Empty);

                if (usePinyin)
                {
                    var pinyinStr = arrayToParse[1].ToLower();

                    var pinyin = Regex.Replace(pinyinStr, PinyinExludeRegexPattern, string.Empty);

                    if (pinyin.Contains(solidSyllables))
                    {
                        goodWords.Add(new Word
                        {
                            OriginalWord = mainWord,
                            Pronunciation = separatedSyllables,
                            Translation = translationNative,
                            SyllablesCount = syllables.Length
                        });
                    }
                    else if (syllables.Length > MaxSyllablesToParse)
                    {
                        badWords.Add(word +
                                     $" (String is too long. Max syllables count is {MaxSyllablesToParse}.)");
                    }
                    else
                    {
                        var useNum = IsNumbersInPinyinUsed(pinyinStr);
                        var leftPinyin = useNum ? pinyinStr : pinyin;
                        var successFlag = false;


                        var importedSyllables = new List<Syllable>();

                        foreach (var syllable in syllables.Reverse())
                        {
                            successFlag = false;
                            var chineseChar = syllable.ChineseChar;

                            foreach (var pinyinOption in _chinesePinyinConverter.Convert(chineseChar,
                                useNum ? EToneType.Number : EToneType.Mark))
                            {
                                var numFreePinyinOption = Regex.Replace(pinyinOption, PinyinExludeRegexPattern,
                                    string.Empty);

                                var allMarkTones = _chinesePinyinConverter.ToSyllablesAllTones(numFreePinyinOption);

                                var allTones = useNum
                                    ? _chinesePinyinConverter.ToSyllablesNumberAllTones(pinyinOption)
                                    : allMarkTones;

                                var tonesToLoop = allTones.Where(a => a != null).ToArray();

                                for (var i = 0; i < tonesToLoop.Length; i++)
                                {
                                    var tone = tonesToLoop[i];

                                    if (leftPinyin.EndsWith(tone))
                                    {
                                        leftPinyin = leftPinyin.Remove(leftPinyin.Length - tone.Length,
                                            tone.Length);

                                        successFlag = true;

                                        if (useNum)
                                        {
                                            var markTone = allMarkTones[i];

                                            syllable.Pinyin = markTone;
                                            syllable.Color =
                                                _syllableColorProvider.GetSyllableColor(syllable.ChineseChar, tone);
                                        }

                                        importedSyllables.Insert(0,
                                            useNum ? syllable : GetSyllable(syllable.ChineseChar, tone));
                                        break;
                                    }
                                }

                                if (successFlag)
                                    break;
                            }

                            if (!successFlag)
                                break;
                        }

                        if (successFlag)
                            goodWords.Add(new Word
                            {
                                OriginalWord = mainWord,
                                Pronunciation =
                                    _syllablesToStringConverter.Join(importedSyllables.Select(a => a.Pinyin)),
                                Translation = translationNative.Replace(ImportSeparator1, ReplaceSeparator)
                                    .Replace(ImportSeparator2, ReplaceSeparator),
                                SyllablesCount = importedSyllables.Count
                            });
                        else
                            badWords.Add(word + " (the pinyin is not quite suit for these chinese characters.)");
                    }
                    continue;
                }

                goodWords.Add(new Word
                {
                    OriginalWord = mainWord,
                    Pronunciation = separatedSyllables,
                    Translation = translationNative,
                    SyllablesCount = syllables.Length
                });
            }

            return new ImportWordResult(goodWords.ToArray(), badWords.ToArray());
        }

        private Syllable[] GetOrderedSyllables(string word, EToneType format)
        {
            var outSyllables = new List<Syllable>();

            foreach (var charWord in word)
            {
                var pinyinStringArray = _chinesePinyinConverter.Convert(charWord, format);
                if (pinyinStringArray == null || pinyinStringArray.Length == 0)
                    continue;

                var pinyinWithMark = pinyinStringArray[0];

                var syllable = GetSyllable(charWord, pinyinWithMark);
                outSyllables.Add(syllable);
            }

            return outSyllables.ToArray();
        }

        #endregion
    }
}