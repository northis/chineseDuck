using System;
using System.Linq;
using System.Text.RegularExpressions;
using chineseDuck.pinyin4net;
using chineseDuck.pinyin4net.Format;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;

namespace ChineseDuck.Bot.Providers
{
    public class Pinyin4NetConverter : IChinesePinyinConverter
    {
        #region Fields

        public const string PinyinExcludeRegexPattern = "[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]";
        public const string PinyinVowelOnlyRegexPattern = "[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜaeiouü]";

        public const string FirstTonePattern = "[āēīōūǖ]";
        public const string SecondTonePattern = "[áéíóúǘ]";
        public const string ThirdTonePattern = "[ǎěǐǒǔǚ]";
        public const string ForthTonePattern = "[àèìòùǜ]";

        public const ushort TonesTotalCount = 5;

        public const string PatternA = "[aāáǎà]";
        public const string PatternE = "[eēéěè]";
        public const string PatternI = "[iīíǐì]";
        public const string PatternO = "[oōóǒò]";
        public const string PatternU = "[uūúǔù]";
        public const string PatternÜ = "[üǖǘǚǜ]";

        #endregion

        #region Methods

        public string[] Convert(char chineseCharacter, EToneType toneType)
        {
            var format = new HanyuPinyinOutputFormat
            {
                CaseType = HanyuPinyinCaseType.Lowercase,
                ToneType = HanyuPinyinToneType.WithToneMark,
                VCharType = HanyuPinyinVCharType.WithUUnicode
            };

            switch (toneType)
            {
                case EToneType.Without:
                    format.ToneType = HanyuPinyinToneType.WithoutTone;
                    break;

                case EToneType.Number:
                    format.ToneType = HanyuPinyinToneType.WithToneNumber;
                    break;
            }

            return PinyinHelper.ToHanyuPinyinStringArray(chineseCharacter, format);
        }

        public bool AreMarkPinyinSameIgnoreTone(string pinyin1, string pinyin2)
        {
            return ToSyllablesWithoutTone(pinyin1) == ToSyllablesWithoutTone(pinyin2);
        }

        private string ToSyllablesWithoutTone(string syllableMarkTone)
        {
            syllableMarkTone = syllableMarkTone.ToLower();
            syllableMarkTone = Regex.Replace(syllableMarkTone, PinyinExcludeRegexPattern, string.Empty);

            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternA, "a");
            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternE, "e");
            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternI, "i");
            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternO, "o");
            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternU, "u");
            syllableMarkTone = Regex.Replace(syllableMarkTone, PatternÜ, "ü");

            return syllableMarkTone;
        }

        public string ToSyllableNumberTone(string syllableMarkTone)
        {
            var toneNumber = 0;

            if (Regex.Match(syllableMarkTone, FirstTonePattern).Success)
                toneNumber = 1;
            else if (Regex.Match(syllableMarkTone, SecondTonePattern).Success)
                toneNumber = 2;
            else if (Regex.Match(syllableMarkTone, ThirdTonePattern).Success)
                toneNumber = 3;
            else if (Regex.Match(syllableMarkTone, ForthTonePattern).Success)
                toneNumber = 4;

            return ToSyllablesWithoutTone(syllableMarkTone) + toneNumber;
        }

        private string[] GetAllTonesBucket(string syllableMarkTone, string patternLetter)
        {
            var result = new string[TonesTotalCount];

            var match = Regex.Match(syllableMarkTone, patternLetter);
            if (match.Success)
            {
                var lettersOnly = patternLetter.Replace("[", "").Replace("]", "");
                var lettersOnlyLength = lettersOnly.Length;

                if (lettersOnlyLength < TonesTotalCount)
                    throw new Exception(
                        $"Letters count in the pattern [{patternLetter}] less than ({TonesTotalCount})");

                for (var i = 0; i < lettersOnlyLength; i++)
                {
                    var vowelOption = patternLetter.Replace("[", "").Replace("]", "")[i];
                    result[i] = syllableMarkTone.Replace(syllableMarkTone[match.Index], vowelOption);
                }
            }

            return result;
        }

        public string[] ToSyllablesAllTones(string syllableMarkTone)
        {
            var result = GetAllTonesBucket(syllableMarkTone, PatternA);
            if (result != null && result.Count(a => a != null) > 0)
                return result;

            result = GetAllTonesBucket(syllableMarkTone, PatternE);
            if (result != null && result.Count(a => a != null) > 0)
                return result;

            result = GetAllTonesBucket(syllableMarkTone, PatternI);
            if (result != null && result.Count(a => a != null) > 0)
                return result;

            result = GetAllTonesBucket(syllableMarkTone, PatternO);
            if (result != null && result.Count(a => a != null) > 0)
                return result;

            result = GetAllTonesBucket(syllableMarkTone, PatternU);
            if (result != null && result.Count(a => a != null) > 0)
                return result;

            result = GetAllTonesBucket(syllableMarkTone, PatternÜ);
            return result;
        }

        public string[] ToSyllablesNumberAllTones(string syllableNumberTone)
        {
            var cleanSyll = Regex.Replace(syllableNumberTone, ReplaceExludeRegexPattern, string.Empty);

            return new[] {cleanSyll + "0", cleanSyll + "1", cleanSyll + "2", cleanSyll + "3", cleanSyll + "4"};
        }

        public const string ReplaceExludeRegexPattern = "[^a-z]";

        #endregion
    }
}