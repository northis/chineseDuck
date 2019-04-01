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
 * NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

using System;
using chineseDuck.pinyin4net.Exceptions;
using chineseDuck.pinyin4net.Format;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace chineseDuck.pinyin4net.UnitTests {
    [TestFixture]
    public class HanyuPinyinTest {
        [Test]
        [Description ("Test get hanyupinyin with upper case format")]
        //  Simplified Chinese
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "LU:3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "LI3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, ExpectedResult = "LV3")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, ExpectedResult = "LI3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "LÜ3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "LI3")]
        //  Traditional Chinese
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "LU:3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, ExpectedResult = "LV3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "LÜ3")]
        public string TestCaseType (char ch, HanyuPinyinVCharType vcharType) {
            var format = new HanyuPinyinOutputFormat {
            CaseType = HanyuPinyinCaseType.Uppercase,
            VCharType = vcharType
            };
            return PinyinHelper.ToHanyuPinyinStringArray (ch, format) [0];
        }

        [Test]
        [Category ("Simplified Chinese")]
        [Description ("Test character with multiple pronunciations")]

        #region Test data

        //  Simplified Chinese
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou2", "lu:3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU2", "LU:3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase,
            ExpectedResult = new [] { "lou2", "lv3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase,
            ExpectedResult = new [] { "LOU2", "LV3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou2", "lü3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU2", "LÜ3" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou", "lu:" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU", "LU:" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase,
            ExpectedResult = new [] { "lou", "lv" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase,
            ExpectedResult = new [] { "LOU", "LV" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou", "lü" })]
        [TestCase ('偻', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU", "LÜ" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneMark, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lóu", "lǚ" })]
        [TestCase ('偻', HanyuPinyinToneType.WithToneMark, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LÓU", "LǙ" })]
        //  Traditional Chinese
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou2", "lu:3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU2", "LU:3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase,
            ExpectedResult = new [] { "lou2", "lv3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase,
            ExpectedResult = new [] { "LOU2", "LV3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou2", "lü3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneNumber, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU2", "LÜ3" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou", "lu:" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUAndColon,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU", "LU:" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase,
            ExpectedResult = new [] { "lou", "lv" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase,
            ExpectedResult = new [] { "LOU", "LV" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lou", "lü" })]
        [TestCase ('僂', HanyuPinyinToneType.WithoutTone, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LOU", "LÜ" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneMark, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Lowercase, ExpectedResult = new [] { "lóu", "lǚ" })]
        [TestCase ('僂', HanyuPinyinToneType.WithToneMark, HanyuPinyinVCharType.WithUUnicode,
            HanyuPinyinCaseType.Uppercase, ExpectedResult = new [] { "LÓU", "LǙ" })]

        #endregion

        public string[] TestCharWithMultiplePronunciations (
            char ch, HanyuPinyinToneType toneType,
            HanyuPinyinVCharType vcharType, HanyuPinyinCaseType caseType) {
            var format = new HanyuPinyinOutputFormat {
                ToneType = toneType,
                    VCharType = vcharType,
                    CaseType = caseType
            };
            return PinyinHelper.ToHanyuPinyinStringArray (ch, format);
        }

        [Test]
        [Description ("Test non Chinese character input")]
        [TestCase ('A')]
        [TestCase ('ガ')]
        [TestCase ('ç')]
        [TestCase ('匇')]
        public void TestNonChineseCharacter (char ch) {
            Assert.IsNull (PinyinHelper.ToHanyuPinyinStringArray (ch));
        }

        [Test]
        [Description ("Test null input")]
        public void TestNullInput () {

            Assert.Throws<ArgumentNullException> (() => PinyinHelper.ToHanyuPinyinStringArray ('李', null));
        }

        [Test]
        [Description ("Test get hanyupinyin with tone mark format")]

        #region Test data

        //  Simplified Chinese
        [TestCase ('爸', ExpectedResult = "bà")]
        [TestCase ('波', ExpectedResult = "bō")]
        [TestCase ('苛', ExpectedResult = "kē")]
        [TestCase ('李', ExpectedResult = "lǐ")]
        [TestCase ('露', ExpectedResult = "lù")]
        [TestCase ('吕', ExpectedResult = "lǚ")]
        [TestCase ('来', ExpectedResult = "lái")]
        [TestCase ('背', ExpectedResult = "bèi")]
        [TestCase ('宝', ExpectedResult = "bǎo")]
        [TestCase ('抠', ExpectedResult = "kōu")]
        [TestCase ('虾', ExpectedResult = "xiā")]
        [TestCase ('携', ExpectedResult = "xié")]
        [TestCase ('表', ExpectedResult = "biǎo")]
        [TestCase ('球', ExpectedResult = "qiú")]
        [TestCase ('花', ExpectedResult = "huā")]
        [TestCase ('落', ExpectedResult = "luò")]
        [TestCase ('槐', ExpectedResult = "huái")]
        [TestCase ('徽', ExpectedResult = "huī")]
        [TestCase ('月', ExpectedResult = "yuè")]
        [TestCase ('汗', ExpectedResult = "hàn")]
        [TestCase ('狠', ExpectedResult = "hěn")]
        [TestCase ('邦', ExpectedResult = "bāng")]
        [TestCase ('烹', ExpectedResult = "pēng")]
        [TestCase ('轰', ExpectedResult = "hōng")]
        [TestCase ('天', ExpectedResult = "tiān")]
        [TestCase ('银', ExpectedResult = "yín")]
        [TestCase ('鹰', ExpectedResult = "yīng")]
        [TestCase ('想', ExpectedResult = "xiǎng")]
        [TestCase ('炯', ExpectedResult = "jiǒng")]
        [TestCase ('环', ExpectedResult = "huán")]
        [TestCase ('云', ExpectedResult = "yún")]
        [TestCase ('黄', ExpectedResult = "huáng")]
        [TestCase ('渊', ExpectedResult = "yuān")]
        [TestCase ('儿', ExpectedResult = "er")]
        //  Traditional Chinese
        [TestCase ('呂', ExpectedResult = "lǚ")]
        [TestCase ('來', ExpectedResult = "lái")]
        [TestCase ('寶', ExpectedResult = "bǎo")]
        [TestCase ('摳', ExpectedResult = "kōu")]
        [TestCase ('蝦', ExpectedResult = "xiā")]
        [TestCase ('攜', ExpectedResult = "xié")]
        [TestCase ('轟', ExpectedResult = "hōng")]
        [TestCase ('銀', ExpectedResult = "yín")]
        [TestCase ('鷹', ExpectedResult = "yīng")]
        [TestCase ('環', ExpectedResult = "huán")]
        [TestCase ('雲', ExpectedResult = "yún")]
        [TestCase ('黃', ExpectedResult = "huáng")]
        [TestCase ('淵', ExpectedResult = "yuān")]
        [TestCase ('兒', ExpectedResult = "ér")]

        #endregion

        public string TestToneMark (char ch) {
            var format = new HanyuPinyinOutputFormat {
            ToneType = HanyuPinyinToneType.WithToneMark,
            VCharType = HanyuPinyinVCharType.WithUUnicode
            };

            return PinyinHelper.ToHanyuPinyinStringArray (ch, format) [0];
        }

        [Test]
        [Description ("Test get hanyupinyin with invalid format")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon)]
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon)]
        public void TestToneMarkWithUAndColon (char ch, HanyuPinyinVCharType vcharType) {
            var format = new HanyuPinyinOutputFormat {
                ToneType = HanyuPinyinToneType.WithToneMark,
                VCharType = vcharType
            };

            Assert.Throws<InvalidHanyuPinyinFormatException> (() => PinyinHelper.ToHanyuPinyinStringArray (ch, format));
        }

        [Test]
        [Description ("Test get hanyupinyin with different VCharType format")]
        //  Simplified Chinese
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "lu:3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "li3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, ExpectedResult = "lv3")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, ExpectedResult = "li3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "lü3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "li3")]
        //  Traditional Chinese
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, ExpectedResult = "lu:3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, ExpectedResult = "lv3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, ExpectedResult = "lü3")]
        public string TestVCharType (char ch, HanyuPinyinVCharType vcharType) {
            var format = new HanyuPinyinOutputFormat { VCharType = vcharType };
            return PinyinHelper.ToHanyuPinyinStringArray (ch, format) [0];
        }

        [Test]
        [Description ("Test get hanyupinyin with out tone format")]

        #region Test data

        //  Simplified Chinese
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lu:")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LU:")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lv")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LV")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lü")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LÜ")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI")]
        //  Traditional Chinese
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lu:")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LU:")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lv")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LV")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lü")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LÜ")]

        #endregion

        public string TestWithoutToneNumber (
            char ch, HanyuPinyinVCharType vcharType, HanyuPinyinCaseType caseType) {
            var format = new HanyuPinyinOutputFormat {
            ToneType = HanyuPinyinToneType.WithoutTone,
            VCharType = vcharType,
            CaseType = caseType
            };
            return PinyinHelper.ToHanyuPinyinStringArray (ch, format) [0];
        }

        [Test]
        [Description ("Test get hanyupinyin with tone number format")]

        #region Test data

        //  Simplified Chinese
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lu:3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LU:3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lv3")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LV3")]
        [TestCase ('李', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lü3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "li3")]
        [TestCase ('吕', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LÜ3")]
        [TestCase ('李', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LI3")]
        //  Traditional Chinese
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lu:3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUAndColon, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LU:3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lv3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithV, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LV3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Lowercase, ExpectedResult = "lü3")]
        [TestCase ('呂', HanyuPinyinVCharType.WithUUnicode, HanyuPinyinCaseType.Uppercase, ExpectedResult = "LÜ3")]

        #endregion

        public string TestWithToneNumber (
            char ch, HanyuPinyinVCharType vcharType, HanyuPinyinCaseType caseType) {
            var format = new HanyuPinyinOutputFormat {
            ToneType = HanyuPinyinToneType.WithToneNumber,
            VCharType = vcharType,
            CaseType = caseType
            };
            return PinyinHelper.ToHanyuPinyinStringArray (ch, format) [0];
        }
    }
}