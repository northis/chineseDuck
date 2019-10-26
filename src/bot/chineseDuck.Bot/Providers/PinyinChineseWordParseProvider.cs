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

        public const string PinyinExcludeRegexPattern = "[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]";
        public const string PinyinNumIncludeRegexPattern = "^[a-z0-4]+$";

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
        /// Builds correct syllable for the chinese character and its latin representation
        /// </summary>
        /// <param name="chineseChar">Chinese character, ex. 电</param>
        /// <param name="pinyinWithNumber">Pinyin with in number-style, ex. dian4</param>
        /// <returns>Syllable with tone-style, ex. diàn</returns>
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
        /// Imports and parses the words.
        /// Example: 电;diàn;electricity
        ///          电;;electricity;usage
        ///          电;dian4;electricity;usage
        /// </summary>
        /// <param name="rawWords">Array of words to parse</param>
        /// <returns>Parsed strings</returns>
        public ImportWordResult ImportWords(string[] rawWords)
        {
            var goodWords = new List<Word>();
            var badWords = new List<string>();
            
            foreach (var word in rawWords)
            {
                var arrayToParse = word.Split(new[] {ImportSeparator1, ImportSeparator2});
                if (arrayToParse.Length < 2)
                {
                    badWords.Add(word);
                    continue;
                }

                var usePinyin = !string.IsNullOrEmpty(arrayToParse[1]);
                var mainWord = arrayToParse[0];

                var translationIndex = 2;
                var usageIndex = translationIndex+1;
                var translationNative = arrayToParse[translationIndex];

                var usage = string.Empty;
                if (arrayToParse.Length > usageIndex)
                    usage = string.Join(ImportSeparator1, arrayToParse.Skip(usageIndex));

                var syllables = GetOrderedSyllables(mainWord, EToneType.Mark);
                var separatedSyllables = _syllablesToStringConverter.Join(syllables.Select(a => a.Pinyin));
                var solidSyllables = separatedSyllables.Replace(
                    _syllablesToStringConverter.GetSeparator(),
                    string.Empty);

                if (usePinyin)
                {
                    ParsePinyin(new ImportWordLoopItem(arrayToParse, goodWords, syllables, solidSyllables, mainWord,
                        word, translationNative, separatedSyllables, badWords, usage));
                    continue;
                }

                goodWords.Add(new Word
                {
                    OriginalWord = mainWord,
                    Pronunciation = separatedSyllables,
                    Translation = translationNative,
                    SyllablesCount = syllables.Length,
                    Usage = usage
                });
            }

            return new ImportWordResult(goodWords.ToArray(), badWords.ToArray());
        }

        private void ParsePinyin(ImportWordLoopItem item)
        {
            var pinyinStr = item.ArrayToParse[1].ToLower();
            var pinyin = Regex.Replace(pinyinStr, PinyinExcludeRegexPattern, string.Empty);

            if (pinyin.Contains(item.SolidSyllables))
            {
                item.GoodWords.Add(new Word
                {
                    OriginalWord = item.MainWord,
                    Pronunciation = item.SeparatedSyllables,
                    Translation = item.TranslationNative,
                    SyllablesCount = item.Syllables.Length,
                    Usage = item.Usage
                });
                return;
            }
            if (item.Syllables.Length > MaxSyllablesToParse)
            {
                item.BadWords.Add(item.RawWord +
                             $" (String is too long. Max syllables count is {MaxSyllablesToParse}.)");
                return;
            }

            var useNum = IsNumbersInPinyinUsed(pinyinStr);
            var leftPinyin = useNum ? pinyinStr : pinyin;
            var successFlag = false;

            var importedSyllables = new List<Syllable>();

            foreach (var syllable in item.Syllables.Reverse())
            {
                successFlag = false;
                var chineseChar = syllable.ChineseChar;

                foreach (var pinyinOption in _chinesePinyinConverter.Convert(chineseChar,
                    useNum ? EToneType.Number : EToneType.Mark))
                {
                    var numFreePinyinOption = Regex.Replace(pinyinOption, PinyinExcludeRegexPattern,
                        string.Empty);

                    var allMarkTones = _chinesePinyinConverter.ToSyllablesAllTones(numFreePinyinOption);

                    var allTones = useNum
                        ? _chinesePinyinConverter.ToSyllablesNumberAllTones(pinyinOption)
                        : allMarkTones;

                    var tonesToLoop = allTones.Where(a => a != null).ToArray();
                    for (var i = 0; i < tonesToLoop.Length; i++)
                    {
                        var tone = tonesToLoop[i];
                        if (!leftPinyin.EndsWith(tone))
                            continue;

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

                    if (successFlag)
                        break;
                }

                if (!successFlag)
                    break;
            }

            if (successFlag)
            {
                item.GoodWords.Add(new Word
                {
                    OriginalWord = item.MainWord,
                    Pronunciation =
                        _syllablesToStringConverter.Join(importedSyllables.Select(a => a.Pinyin)),
                    Translation = item.TranslationNative.Replace(ImportSeparator1, ReplaceSeparator)
                        .Replace(ImportSeparator2, ReplaceSeparator),
                    SyllablesCount = importedSyllables.Count,
                    Usage = item.Usage
                });
            }
            else
            {
                item.BadWords.Add(item.RawWord + " (the pinyin is not quite suit for these chinese characters.)");
            }
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

        private class ImportWordLoopItem
        {
            public ImportWordLoopItem(string[] arrayToParse, List<Word> goodWords, Syllable[] syllables,
                string solidSyllables, string mainWord, string rawWord, string translationNative,
                string separatedSyllables, List<string> badWords, string usage)
            {
                ArrayToParse = arrayToParse;
                GoodWords = goodWords;
                Syllables = syllables;
                SolidSyllables = solidSyllables;
                MainWord = mainWord;
                RawWord = rawWord;
                TranslationNative = translationNative;
                SeparatedSyllables = separatedSyllables;
                BadWords = badWords;
                Usage = usage;
            }

            public string[] ArrayToParse { get; }
            public string SolidSyllables { get; }
            public string MainWord { get; }
            public string RawWord { get; }
            public string TranslationNative { get; }
            public string SeparatedSyllables { get; }
            public Syllable[] Syllables { get; }
            public string Usage { get; }
            public List<Word> GoodWords { get; }
            public List<string> BadWords { get; }
        }
    }
}