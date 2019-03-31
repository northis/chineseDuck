/**
 * Copyright (c) 2012 Yang Kuang
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using chineseDuck.pinyin4net.Exceptions;

namespace chineseDuck.pinyin4net.Format
{
    /// <summary>
    ///     This class can convert Hanyu pinyin between different format.
    /// </summary>
    internal class PinyinFormatter
    {
        /// <summary>
        ///     Convert Hanyu pinyin to given format
        /// </summary>
        /// <param name="pinyin">The given Hanyu pinyin string </param>
        /// <param name="outputFormat">The given format</param>
        /// <returns>The Hanyu pinyin with given format</returns>
        internal static string FormatHanyuPinyin(
            string pinyin, HanyuPinyinOutputFormat outputFormat)
        {
            if (outputFormat == null)
                throw new ArgumentNullException(nameof(outputFormat));

            if (outputFormat.ToneType == HanyuPinyinToneType.WithToneMark
                && (outputFormat.VCharType == HanyuPinyinVCharType.WithUAndColon ||
                    outputFormat.VCharType == HanyuPinyinVCharType.WithV))
                throw new InvalidHanyuPinyinFormatException("Tone marks cannot be added to v or u:");

            var result = pinyin.ToLower();

            if (outputFormat.ToneType == HanyuPinyinToneType.WithoutTone)
                result = Regex.Replace(pinyin, "[0-9]", "");
            else if (outputFormat.ToneType == HanyuPinyinToneType.WithToneMark)
                result = ConvertToneNumber2ToneMark(result.Replace("u:", "v"));

            if (outputFormat.VCharType == HanyuPinyinVCharType.WithV)
                result = result.Replace("u:", "v");
            else if (outputFormat.VCharType == HanyuPinyinVCharType.WithUUnicode)
                result = result.Replace("u:", "ü");

            if (outputFormat.CaseType == HanyuPinyinCaseType.Uppercase)
                result = result.ToUpper();

            return result;
        }

        #region Private Functions

        private static string ConvertToneNumber2ToneMark(
            string pinyinWithToneNumber)
        {
            var result = pinyinWithToneNumber.ToLower();
            result = result.Replace("u:", "ü");
            result = result.Replace("v", "ü");
            var aRule = CreateReplaceRule("a", "āáǎàa");
            var oRule = CreateReplaceRule("o", "ōóǒòo");
            var eRule = CreateReplaceRule("e", "ēéěèe");
            var iRule = CreateReplaceRule("i", "īíǐìi");
            var uRule = CreateReplaceRule("u", "ūúǔùu");
            var vRule = CreateReplaceRule("ü", "ǖǘǚǜü");
            var iuRule = CreateReplaceRule("iu", "iūiúiǔiùiu");
            var uiRule = CreateReplaceRule("ui", "uīuíuǐuìui");
            var rules =
                new[]
                {
                    aRule, oRule, eRule, iuRule, uiRule, iRule, uRule, vRule
                };


            if (Regex.IsMatch(result, "^[a-zü]*[1-5]$"))
            {
                var toneNumber = int.Parse(result.Last().ToString());
                result = Regex.Replace(result, "[1-5]", "");
#if DEBUG
                Console.WriteLine("The tone number of " + pinyinWithToneNumber + "is: " + toneNumber);
#endif
                try
                {
                    foreach (var t in rules)
                        if (result.IndexOf(t.Key, StringComparison.Ordinal) > -1)
                            return ConvertPinyinToToneMarkImpl(result, toneNumber, t);
                }
                catch (Exception ex)
                {
                    Trace.Write(ex.ToString());
                }
            }
            return result;
        }

        private static KeyValuePair<string, List<string>> CreateReplaceRule(
            string ruleName, string ruleString)
        {
            var result =
                new KeyValuePair<string, List<string>>(ruleName, new List<string>());

            var i = 0;
            while (i < ruleString.Length)
            {
                result.Value.Add(ruleString.Substring(i, ruleName.Length));
                i += ruleName.Length;
            }

            return result;
        }

        private static string ConvertPinyinToToneMarkImpl(
            string pinyin, int toneNumber, KeyValuePair<string, List<string>> rule)
        {
            if (rule.Value == null || toneNumber < 1
                || toneNumber > rule.Value.Count)
                throw new ArgumentOutOfRangeException(nameof(toneNumber));

            var replacement = rule.Value[toneNumber - 1];
            return pinyin.Replace(rule.Key, replacement);
        }

        #endregion
    }
}