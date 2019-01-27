using System.Drawing;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Providers;
using ChineseDuck.Bot.Rest.Model;
using NUnit.Framework;
using YellowDuck.LearnChinese.Providers;

namespace ChineseDuck.Bot.Tests
{
    public class Tests
    {

        [Test]
        public void AddWordToDictionaryTest()
        {
            var colorProv = new ClassicSyllableColorProvider();
            var pinyinProv = new Pinyin4NetConverter();
            var tostrConv = new ClassicSyllablesToStringConverter();
            var prov = new PinyinChineseWordParseProvider(colorProv, pinyinProv, tostrConv);

            var stringsToImport = new[] { "明!!白!;míngbai;понимать" };

            var wordsResult = prov.ImportWords(stringsToImport, true);

            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 0);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "明!!白!");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Pronunciation == "míng|bai");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "понимать");

            stringsToImport = new[] { "你有病吗?你有药吗?;- ты больной? (шутл.) - а есть лекарство?" };

            wordsResult = prov.ImportWords(stringsToImport, false);

            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 0);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "你有病吗?你有药吗?");
            //Assert.IsTrue(wordsResult.SuccessfulWords[0].PinyinWord == "míng|bai");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "- ты больной? (шутл.) - а есть лекарство?");


            var result = prov.GetOrderedSyllables(wordsResult.SuccessfulWords[0]);
            Assert.AreEqual("yào", result[7].Pinyin);
        }

        [Test]
        public void AnswerPollTest()
        {
        }

        [Test]
        public void BuildValidSyllableTest()
        {
            var colorProv = new ClassicSyllableColorProvider();
            var pinyinProv = new Pinyin4NetConverter();
            var tostrConv = new ClassicSyllablesToStringConverter();
            var prov = new PinyinChineseWordParseProvider(colorProv, pinyinProv, tostrConv);
            var chineseChar = '体';
            var pinyinNumber = "ti3";
            var pinyinMark = "tǐ";

            var syll = prov.BuildSyllable(chineseChar, pinyinNumber);

            Assert.AreEqual(pinyinMark, syll.Pinyin);
        }

        [Test]
        public void GenerateImageForWordTest()
        {
            //var prov = GetChineseWordParseProvider();

            //var grn = new WpfFlashCardGenerator(prov);
            //var word = new Word
            //{
            //    OriginalWord = "明?白!!",
            //    Pronunciation = "míng|bai",
            //    Translation = "понимать"
            //};

            //var result = grn.Generate(word, ELearnMode.FullView);

            //Assert.IsTrue(result.ImageBody?.Length > 0);
            //System.IO.File.WriteAllBytes(@"D:\test.png", result);
        }

        public static IChineseWordParseProvider GetChineseWordParseProvider()
        {
            var colorProv = new ClassicSyllableColorProvider();
            var pinyinProv = new Pinyin4NetConverter();
            var tostrConv = new ClassicSyllablesToStringConverter();
            return new PinyinChineseWordParseProvider(colorProv, pinyinProv, tostrConv);
        }

        [Test]
        public void GetColorTest()
        {
            var prov = new ClassicSyllableColorProvider();
            var chineseChar = '电';
            var pinyinMark = "dian4";
            var trueColor = Color.Blue;

            var syllColor = prov.GetSyllableColor(chineseChar, pinyinMark);

            Assert.AreEqual(trueColor, syllColor);
        }

        [Test]
        public void ParseWordClassTest()
        {
            var colorProv = new ClassicSyllableColorProvider();
            var pinyinProv = new Pinyin4NetConverter();
            var tostrConv = new ClassicSyllablesToStringConverter();
            var prov = new PinyinChineseWordParseProvider(colorProv, pinyinProv, tostrConv);

            var word = new Word
            {
                OriginalWord = "明?白!!",
                Pronunciation = "míng|bai",
                Translation = "понимать"
            };

            var result = prov.GetOrderedSyllables(word);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Length == 5);
            Assert.IsTrue(result[0].ChineseChar == '明');
            Assert.IsTrue(result[0].Color == Color.Orange);
            Assert.IsTrue(result[0].Pinyin == "míng");


            Assert.IsTrue(result[2].ChineseChar == '白');
            Assert.IsTrue(result[2].Color == Color.Black);
            Assert.IsTrue(result[2].Pinyin == "bai");
        }

        [Test]
        public void ParseWordTest()
        {
            var pinyinProv = new Pinyin4NetConverter();
            var tostrConv = new ClassicSyllablesToStringConverter();
            var prov = new PinyinChineseWordParseProvider(new ClassicSyllableColorProvider(), pinyinProv, tostrConv);
            var word = "体育馆";
            //PinyinWord = "tǐyùguǎn",
            //TranslationNative = "Спортзал",
            //TranslationEng = "gym"

            var syllablesToCheck = new[] { "tǐ", "yù", "guǎn" };
            var syllables = prov.GetOrderedSyllables(word);

            Assert.IsTrue(syllables.Length > 0);

            for (var i = 0; i < syllablesToCheck.Length; i++)
                Assert.AreEqual(syllablesToCheck[i], syllables[i].Pinyin);
        }
    }
}