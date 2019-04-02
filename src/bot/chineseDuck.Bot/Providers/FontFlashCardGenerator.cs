using System;
using System.IO;
using System.Linq;
using System.Text;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.TextBuilder;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using SixLabors.Shapes;
using Path = System.IO.Path;

namespace ChineseDuck.Bot.Providers
{
    public class FontFlashCardGenerator : IFlashCardGenerator
    {
        private const int MaxHeight = 500;
        private const int MaxWidth = 500;
        private const int HanFont = 48;
        private const int MainFont = 22;
        private const int LineSpace = 5;
        private const int Padding = 5;
        private const int HanMaxLineCharsCount = 7;
        private const int HanMaxLinesCount = 3;
        private const int HanMaxCharsCount = HanMaxLineCharsCount * HanMaxLinesCount;
        private const int MainMaxLineCharsCount = 20;
        private const int MainMaxLinesCount = 3;
        private const int MainMaxCharsCount = MainMaxLineCharsCount * MainMaxLinesCount;
        private const int ViewPortWidth = MaxWidth - 2* Padding;

        private const string KaiTiFile = @"Fonts/KaiTi.ttf";
        private const string ArialUnicodeMsFile = @"Fonts/ArialUnicodeMS.ttf";
        private static readonly Font KaitiHanFont;
        private static readonly Font KaitiMainFont;
        private static readonly Font ArialUnicodeMainFont;
        
        private static readonly Rgba32 MainColor = Rgba32.Black;
        private static readonly Rgba32 UsageColor = Rgba32.DarkGray;
        private static readonly Rgba32 BackgroundColor = Rgba32.FromHex("#FFFFFF70");

        static FontFlashCardGenerator()
        {
            var fontCollection = new FontCollection();
            var kaiti = fontCollection.Install(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, KaiTiFile));
            var arialUnicode = fontCollection.Install(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ArialUnicodeMsFile));

            KaitiHanFont = new Font(kaiti, HanFont);
            ArialUnicodeMainFont = new Font(arialUnicode, MainFont);
            KaitiMainFont = new Font(kaiti, MainFont);
        }

        private readonly IChineseWordParseProvider _wordParseProvider;

        public FontFlashCardGenerator(IChineseWordParseProvider wordParseProvider)
        {
            _wordParseProvider = wordParseProvider;
        }

        public GenerateImageResult Generate(IWord word, ELearnMode learnMode)
        {
            var result = new GenerateImageResult();
            var syllables = _wordParseProvider.GetOrderedSyllables(word);

            var originalChars = CutToMaxLength(word.OriginalWord, HanMaxCharsCount);

            var originalLength = 0;
            var pinyinLength = 0;

            syllables = syllables.TakeWhile(a =>
            {
                originalLength++;
                pinyinLength += a.Pinyin.Length;

                return pinyinLength < MainMaxCharsCount && originalLength <= originalChars.Length;
            }).ToArray();

            var y = 0f;
            var maxWidth = 0f;
            using (var img = new Image<Rgba32>(MaxWidth, MaxHeight))
            {
                var builder = new GlyphBuilder();
                var renderer = new TextRenderer(builder);

                img.Mutate(a => a.Fill(BackgroundColor));
                
                if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.OriginalWord)
                {
                    var text = CutToMaxRow(originalChars, HanMaxLineCharsCount);
                    var renderOptions = GetRenderOptions(KaitiHanFont, y);
                    var size = TextMeasurer.Measure(text, renderOptions);
                    y += size.Height + LineSpace;

                    if (size.Width > maxWidth)
                        maxWidth = size.Width;

                    var paths = RenderText(builder, renderer, renderOptions, text);

                    for (var i = 0; i < Math.Min(syllables.Length, paths.Length); i++)
                    {
                        var iLocal = i;
                        var syllable = syllables[iLocal];
                        img.Mutate(a => a.Fill(syllable.Color.ToRgba32(), paths[iLocal]));
                    }
                }

                if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.Pronunciation)
                {
                    var text = string.Join(" ", syllables.Select(a => a.Pinyin));
                    var renderOptions = GetRenderOptions(ArialUnicodeMainFont, y);
                    var size = TextMeasurer.Measure(text, renderOptions);
                    y += size.Height + LineSpace;

                    if (size.Width > maxWidth)
                        maxWidth = size.Width;

                    var paths = RenderText(builder, renderer, renderOptions, text);

                    var currentPathPosition = 0;
                    foreach (var syllable in syllables)
                    {
                        if (currentPathPosition >= paths.Length)
                            break;

                        var pathCollection = new PathCollection(paths.Skip(currentPathPosition).Take(syllable.Pinyin.Length));

                        img.Mutate(a => a.Fill(syllable.Color.ToRgba32(), pathCollection));
                        currentPathPosition += syllable.Pinyin.Length;
                    }
                }

                if (learnMode == ELearnMode.FullView || learnMode != ELearnMode.Translation)
                {
                    var renderOptions = GetRenderOptions(ArialUnicodeMainFont, y);
                    var transChars = CutToMaxRow(CutToMaxLength(word.Translation, MainMaxCharsCount, string.Empty),
                        MainMaxLineCharsCount);
                    var size = TextMeasurer.Measure(transChars, renderOptions);
                    y += size.Height + LineSpace;

                    if (size.Width > maxWidth)
                        maxWidth = size.Width;

                    var paths = RenderText(builder, renderer, renderOptions, transChars);
                    img.Mutate(a => a.Fill(MainColor, new PathCollection(paths)));
                }

                if (learnMode == ELearnMode.FullView && !string.IsNullOrEmpty(word.Usage))
                {
                    var usageChars = CutToMaxRow(CutToMaxLength(word.Usage, MainMaxCharsCount), MainMaxLineCharsCount);
                    var renderOptions = GetRenderOptions(KaitiMainFont, y);
                    var size = TextMeasurer.Measure(usageChars, renderOptions);
                    y += size.Height + LineSpace;

                    if (size.Width > maxWidth)
                        maxWidth = size.Width;

                    var paths = RenderText(builder, renderer, renderOptions, usageChars);
                    img.Mutate(a => a.Fill(UsageColor, new PathCollection(paths)));
                }

                var finalWidth = (int) (maxWidth + 2*Padding);
                img.Mutate(a => a.Crop(new Rectangle((MaxWidth - finalWidth) / 2, 0, finalWidth, (int) y)));

                result.Width = img.Width;
                result.Height = img.Height;
                using (var ms = new MemoryStream())
                {
                    img.Save(ms, new PngEncoder());
                    result.ImageBody = ms.ToArray();
                }
            }

            return result;
        }
        
        private static IPath[] RenderText(GlyphBuilder builder, TextRenderer renderer, RendererOptions renderOptions, string text)
        {
            var paths = builder.Paths.ToArray();
            renderer.RenderText(text, renderOptions);
            return builder.Paths.Except(paths).ToArray();
        }

        private static RendererOptions GetRenderOptions(Font font, float yOffset, float xOffset = 0)
        {
            return new RendererOptions(font, 96)
            {
                ApplyKerning = true,
                WrappingWidth = ViewPortWidth,
                HorizontalAlignment = HorizontalAlignment.Center,
                Origin = new PointF(xOffset, yOffset)
            };
        }

        private static string CutToMaxLength(string input, int maxLength, string postfixIfCut = "…")
        {
            if (input == null || maxLength == 0)
                return string.Empty;

            var needCut = input.Length > maxLength;
            return needCut ? input.Substring(0, maxLength - postfixIfCut.Length) + postfixIfCut : input;
        }

        private static string CutToMaxRow(string input, int maxLengthInRow)
        {
            var sb = new StringBuilder();
            var stringCount = 0;

            foreach (var ch in input)
            {
                var curLetter = ch.ToString();
                if (curLetter != " " && curLetter != Environment.NewLine)
                {
                    stringCount++;
                    sb.Append(curLetter);
                }

                if (stringCount == maxLengthInRow)
                {
                    sb.Append(" ");
                    stringCount = 0;
                }
            }

            return sb.ToString();
        }
    }
}
