using System;
using System.Drawing;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.Providers;
using SixLabors.ImageSharp.PixelFormats;

namespace ChineseDuck.Bot.Extensions
{
    public static class MainExtensions
    {
        public static string ToEditString(this IWord word)
        {
            return
                $"{word.OriginalWord}{PinyinChineseWordParseProvider.ImportSeparator1}{word.Pronunciation.Replace("|", string.Empty)}{PinyinChineseWordParseProvider.ImportSeparator1}{word.Translation}";
        }

        public static string ToScoreString(this IWord word)
        {
            if (word.Score == null)
                return "0";

            return
                $"🖌{word.Score.OriginalWordSuccessCount}/{word.Score.OriginalWordCount}, 📢{word.Score.PronunciationSuccessCount}/{word.Score.PronunciationCount}, 🇨🇳{word.Score.TranslationSuccessCount}/{word.Score.TranslationCount}, 👀{word.Score.ViewCount}";
        }

        public static ELearnMode ToELearnMode(this IScore score, long idUser)
        {
            if (!Enum.TryParse(score.LastLearnMode, out ELearnMode learnMode))
                throw new Exception(
                    $"Wrong learn mode has been set. userId={idUser}, learnMode={score.LastLearnMode}");

            return learnMode;
        }
        public static string ToHexString(this Color c)
        {
            return "#" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2");
        }
        public static Rgba32 ToRgba32(this Color c)
        {
            return new Rgba32(c.R, c.G, c.B, c.A);
        }
    }
}