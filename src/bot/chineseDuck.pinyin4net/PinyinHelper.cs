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
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml.Linq;
using Pinyin4net.Format;

namespace chineseDuck.pinyin4net {
    /// <summary>
    ///     Summary description for PinyinHelper.
    /// </summary>
    public class PinyinHelper {
        private static readonly Dictionary<string, string> Dict;

        /// <summary>
        ///     Load unicode-pinyin map to memory while this class first use.
        /// </summary>
        static PinyinHelper()
        {
            Dict = new Dictionary<string, string>();

            var exeFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().GetName().CodeBase);

            if (exeFolder == null)
                throw new InvalidOperationException("Unable to get the exec path");

            var doc = XDocument.Load(Path.Combine(exeFolder, @"Resources\unicode_to_hanyu_pinyin.xml"));

            if (doc.Root == null)
                throw new InvalidOperationException("Unable read the source xml");

            var query =
                from item in doc.Root.Descendants("item")
                select new
                {
                    Unicode = (string) item.Attribute("unicode"),
                    Hanyu = (string) item.Attribute("hanyu")
                };
            foreach (var item in query)
                if (item.Hanyu.Length > 0)
                    Dict.Add(item.Unicode, item.Hanyu);

        }

        /// <summary>
        ///     We don't need any instances of this object.
        /// </summary>
        private PinyinHelper () { }

        /// <summary>
        ///     Get all Hanyu pinyin of a single Chinese character (both
        ///     Simplified Chinese and Traditional Chinese).
        ///     This function is same with:
        ///     ToHanyuPinyinStringArray(ch, new HanyuPinyinOutputFormat());
        ///     For example, if the input is '偻', the return will be an array with
        ///     two Hanyu pinyin strings: "lou2", "lv3". If the input is '李', the
        ///     return will be an array with one Hanyu pinyin string: "li3".
        /// </summary>
        /// <param name="ch">The given Chinese character</param>
        /// <returns>
        ///     A string array contains all Hanyu pinyin presentations; return
        ///     null for non-Chinese character.
        /// </returns>
        public static string[] ToHanyuPinyinStringArray (char ch) {
            return ToHanyuPinyinStringArray (ch, new HanyuPinyinOutputFormat ());
        }

        /// <summary>
        ///     Get all Hanyu pinyin of a single Chinese character (both
        ///     Simplified Chinese and Traditional Chinese).
        /// </summary>
        /// <param name="ch">The given Chinese character</param>
        /// <param name="format">The given output format</param>
        /// <returns>
        ///     A string array contains all Hanyu pinyin presentations; return
        ///     null for non-Chinese character.
        /// </returns>
        public static string[] ToHanyuPinyinStringArray (
            char ch, HanyuPinyinOutputFormat format) {
            return GetFomattedHanyuPinyinStringArray (ch, format);
        }

        #region Private Functions

        private static string[] GetFomattedHanyuPinyinStringArray (
            char ch, HanyuPinyinOutputFormat format) {
            var unformattedArr = GetUnformattedHanyuPinyinStringArray (ch);
            if (null != unformattedArr)
                for (var i = 0; i < unformattedArr.Length; i++)
                    unformattedArr[i] = PinyinFormatter.FormatHanyuPinyin (unformattedArr[i], format);

            return unformattedArr;
        }

        private static string[] GetUnformattedHanyuPinyinStringArray (char ch) {
            var code = $"{(int) ch:X}".ToUpper ();
#if DEBUG
            Console.WriteLine (code);
#endif
            if (Dict.ContainsKey (code))
                return Dict[code].Split (',');

            return null;
        }

        #endregion
    }
}