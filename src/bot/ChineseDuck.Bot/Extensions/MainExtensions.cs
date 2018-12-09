using System;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.Rest.Client;

//using YellowDuck.LearnChinese.Providers;

namespace ChineseDuck.Bot.Extensions
{
    public static class MainExtensions
    {
        //public static string ToEditString(this IWord word)
        //{
        //    return
        //        $"{word.OriginalWord}{PinyinChineseWordParseProvider.ImportSeparator1}{word.Pronunciation.Replace("|", string.Empty)}{PinyinChineseWordParseProvider.ImportSeparator1}{word.Translation}";
        //}

        public static ELearnMode ToELearnMode(this IScore score, long idUser)
        {
            if (!Enum.TryParse(score.LastLearnMode, out ELearnMode learnMode))
                throw new Exception(
                    $"Wrong learn mode has been set. userId={idUser}, learnMode={score.LastLearnMode}");

            return learnMode;
        }
    }
}