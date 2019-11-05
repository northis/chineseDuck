using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Providers;
using ChineseDuck.Bot.Rest.Model;
using NUnit.Framework;
using YellowDuck.LearnChinese.Providers;

namespace chineseDuck.Bot.UnitTests
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
            
            var stringsToImport = new[] { "哪儿;rrr;where? (Beijing accent)" };
            var wordsResult = prov.ImportWords(stringsToImport);
            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "哪儿");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Pronunciation == "nǎ|er");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "where? (Beijing accent)");

            stringsToImport = new[] { "哪儿;nǎr;where? (Beijing accent)" };
            wordsResult = prov.ImportWords(stringsToImport);
            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "哪儿");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Pronunciation == "nǎ|er");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "where? (Beijing accent)");

            stringsToImport = new[] { "明!!白!;míngbai;понимать" };
            wordsResult = prov.ImportWords(stringsToImport);
            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 0);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "明!!白!");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Pronunciation == "míng|bai");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "понимать");

            stringsToImport = new[] { "你有病吗?你有药吗?;;- ты больной? (шутл.) - а есть лекарство?;好吧" };

            wordsResult = prov.ImportWords(stringsToImport);

            Assert.IsNotNull(wordsResult);
            Assert.IsTrue(wordsResult.FailedWords.Length == 0);
            Assert.IsTrue(wordsResult.SuccessfulWords.Length == 1);
            Assert.IsTrue(wordsResult.SuccessfulWords[0].OriginalWord == "你有病吗?你有药吗?");
            //Assert.IsTrue(wordsResult.SuccessfulWords[0].PinyinWord == "míng|bai");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Translation == "- ты больной? (шутл.) - а есть лекарство?");
            Assert.IsTrue(wordsResult.SuccessfulWords[0].Usage == "好吧");

            var result = prov.GetOrderedSyllables(wordsResult.SuccessfulWords[0]);
            Assert.AreEqual("yào", result[7].Pinyin);
        }

        [Test]
        public void BulkImportFromCsv()
        {
            var colorProv = new ClassicSyllableColorProvider();
            var pinyinProv = new Pinyin4NetConverter();
            var toStrConv = new ClassicSyllablesToStringConverter();
            var wordParseProvider = new PinyinChineseWordParseProvider(colorProv, pinyinProv, toStrConv);

            var currentFolder = Directory.GetCurrentDirectory();
            var csvFolder = Path.Combine(currentFolder, "csv");
            var files = Directory.GetFiles(csvFolder).Where(a => a.EndsWith(".csv"));

            foreach (var file in files)
            {
                var lines = File.ReadAllLines(file);
                var wordsResult = wordParseProvider.ImportWords(lines);
                Assert.IsNotNull(wordsResult);

                Console.WriteLine(wordsResult.SuccessfulWords.Length + " " + Path.GetFileName(file));

                var lastIndex = lines.Length - 1;
                Assert.AreEqual(string.IsNullOrEmpty(lines[lastIndex]) ? lastIndex : lines.Length,
                    wordsResult.SuccessfulWords.Length);
            }
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
            var prov = GetChineseWordParseProvider();

            var words = new []
            {
                new Word
                {
                    OriginalWord = "明?白!!",
                    Pronunciation = "míng|bai",
                    Translation = "понимать",
                    Usage = "我明白你"
                },
                new Word
                {
                    OriginalWord = "早饭",
                    Pronunciation = "zǎo|fàn",
                    Translation = "завтрак",
                    Usage = null
                },
                new Word
                {
                    OriginalWord = "午饭",
                    Pronunciation = "wǔ|fàn",
                    Translation = "обед, полдник",
                    Usage = null
                },
                new Word
                {
                    OriginalWord = "晚饭",
                    Pronunciation = "wǎn|fàn",
                    Translation = "ужин",
                    Usage = null
                },
                new Word
                {
                    OriginalWord = "晚饭晚饭晚饭晚饭晚饭晚饭晚饭晚饭晚饭晚饭",
                    Pronunciation = "wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn|wǎn|fàn",
                    Translation = "ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин ужин"
                }
            };

            var grn = new FontFlashCardGenerator(prov);

           //var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            foreach (var word in words)
            {
                var result = grn.Generate(word, ELearnMode.FullView);

                Assert.IsTrue(result.ImageBody?.Length > 0);
                Assert.IsTrue(result.Height > 0);
                Assert.IsTrue(result.Width > 0);
                //File.WriteAllBytes(Path.Combine(baseDir, Guid.NewGuid() + ".png"), result.ImageBody);
            }
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