using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ImageMagick;
using SixLabors.Fonts;

namespace ChineseDuck.Bot.Providers
{
    public class SvgFlashCardGenerator : IFlashCardGenerator
    {
        private const int MaxHeight = 500;
        private const int MaxWidth = 500;
        private const int HanFont = 48;
        private const int MainFont = 22;
        private const int LineSpace = 5;
        private const int Padding = 5;
        private const int HanMaxLineCharsCount = 8;
        private const int HanMaxLinesCount = 3;
        private const int HanMaxCharsCount = HanMaxLineCharsCount * HanMaxLinesCount;
        private const int MainMaxLineCharsCount = 20;
        private const int MainMaxLinesCount = 4;
        private const int MainMaxCharsCount = MainMaxLineCharsCount * MainMaxLinesCount;
        private const int ViewPortWidth = MaxWidth - 2* Padding;
        private const int ViewPortHeight = MaxHeight - 2 * Padding;

        private const string TemplateFile = @"CardRender\templateSvg.svg";
        private const string MainFontWildcard = @"{MainFont}";
        private const string HanFontWildcard = @"{HanFont}";
        private static readonly string Template;

        static SvgFlashCardGenerator()
        {
            var svgPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, TemplateFile);
            Template = File.ReadAllText(svgPath).Replace(MainFontWildcard, MainFont.ToString()).Replace(HanFontWildcard, HanFont.ToString());
        }

        private readonly IChineseWordParseProvider _wordParseProvider;

        public SvgFlashCardGenerator(IChineseWordParseProvider wordParseProvider)
        {
            _wordParseProvider = wordParseProvider;
        }

        public GenerateImageResult Generate(IWord word, ELearnMode learnMode)
        {
            var result = new GenerateImageResult();
            var syllables = _wordParseProvider.GetOrderedSyllables(word);

            var originalChars = CutToMaximumLength(word.OriginalWord, HanMaxCharsCount);
            var transChars = CutToMaximumLength(word.Translation, MainMaxCharsCount, string.Empty);
            var usageChars = CutToMaximumLength(word.Translation, MainMaxCharsCount);

            var originalLength = 0;
            var pinyinLength = 0;

            syllables = syllables.TakeWhile(a =>
            {
                originalLength++;
                pinyinLength += a.Pinyin.Length;

                return pinyinLength < MainMaxCharsCount && originalLength < originalChars.Length;
            }).ToArray();

            var sb = new StringBuilder();

            var x = 0;
            var y = Padding;

            if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.OriginalWord)
            {
                var syllableRows =
                    SplitSyllablesByRows(syllables, sList => sList.Count * HanFont + HanFont > ViewPortWidth);
                
                foreach (var row in syllableRows)
                {
                    var rowWidth = row.Value.Count*HanFont;
                    x = (ViewPortWidth - rowWidth) / 2;
                    y += HanFont;
                    foreach (var syllable in row.Value)
                    {
                        sb.AppendLine(FormatLine(x, y, ECardItem.Han, syllable.Color, syllable.ChineseChar.ToString()));
                        x += HanFont;
                    }
                    y += Padding;
                }

            }

            if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.Pronunciation)
            {
                var syllableRows = SplitSyllablesByRows(syllables,
                    sList => sList.Sum(a => a.Pinyin.Length + 1) * MainFont + MainFont > ViewPortWidth);

                foreach (var row in syllableRows)
                {
                    var rowWidth = row.Value.Sum(a => a.Pinyin.Length + 1) * MainFont - MainFont;

                    x = (ViewPortWidth - rowWidth) / 2;
                    y += MainFont;
                    foreach (var syllable in row.Value)
                    {
                        sb.AppendLine(FormatLine(x, y, ECardItem.Pinyin, syllable.Color, syllable.Pinyin));
                        x += syllable.Pinyin.Length * MainFont;
                    }
                    y += Padding;
                }
            }

            if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.Translation)
            {
            }

            if (learnMode == ELearnMode.FullView && !string.IsNullOrEmpty(word.Usage))
            {
            }

            var htmlPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, TemplateFile);
            var html = File.ReadAllBytes(htmlPath);
            using (MagickImage image = new MagickImage(htmlPath, new MagickReadSettings()
            {
                Format = MagickFormat.Svg
            }))
            {
                var bytes = image.ToByteArray(MagickFormat.Png);

                File.WriteAllBytes(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"CardRender\res.jpg"),bytes);
            }

            return result;
        }

        private static Dictionary<int, List<Syllable>> SplitSyllablesByRows(Syllable[] syllables, Func<List<Syllable>,bool> rowSplitCriteria)
        {
            var syllableRows = new Dictionary<int, List<Syllable>>();
            var line = 0;
            syllableRows[line] = new List<Syllable>();

            foreach (var syllable in syllables)
            {
                syllableRows[line].Add(syllable);
                if (rowSplitCriteria(syllableRows[line]))
                {
                    line++;
                    syllableRows[line] = new List<Syllable>();
                }
            }

            return syllableRows;
        }

        private static Dictionary<int, List<string>> SplitTextByRows(string text)
        {
            var words = text.Split(new[] { " ", Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
            var textRows = new Dictionary<int, List<string>>();
            var line = 0;
            textRows[line] = new List<string>();
            var x = 0;
            var currentPosition = 0;
            var startSolidPart = 0;

            foreach (var word in words)
            {
                var isNewLine = x == 0;
                if (isNewLine && word.Length * MainFont > ViewPortWidth)
                {
                    textRows[line].Add(text.Substring(currentPosition, word.Length));
                    currentPosition += word.Length;
                    line++;
                    textRows[line] = new List<string>();
                    x = 0;
                    continue;
                }

                if (word.Length * MainFont + MainFont > ViewPortWidth)
                {
                    line++;
                    textRows[line] = new List<string>();
                }
            }

            return textRows;
        }

        private static string FormatLine(int x, int y, ECardItem cardItem, Color color, string value)
        {
            return
                $"<text x=\"{x}\" y=\"{y}\" class=\"{cardItem.ToString().ToLower()}\" style=\"fill:{color.Name}\">{value}</text>";
        }

        private static string FormatLine(int x, int y, string @class, Color color, string value)
        {
            return $"<text x=\"{x}\" y=\"{y}\" class=\"{@class}\" style=\"fill:{color.Name}\">{value}</text>";
        }

        private static string CutToMaximumLength(string input, int maxLength, string postfixIfCut = "…")
        {
            if (input == null || maxLength == 0)
                return string.Empty;

            var needCut = input.Length > maxLength;
            return needCut ? input.Substring(0, maxLength - postfixIfCut.Length) + postfixIfCut : input;
        }
    }
}
