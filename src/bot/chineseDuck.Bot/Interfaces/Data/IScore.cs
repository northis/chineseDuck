using System;

namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IScore
    {
        int OriginalWordCount { get; set; }
        int OriginalWordSuccessCount { get; set; }
        int PronunciationCount { get; set; }
        int PronunciationSuccessCount { get; set; }
        int TranslationCount { get; set; }
        int TranslationSuccessCount { get; set; }
        short? RightAnswerNumber { get; set; }
        DateTime LastView { get; set; }
        DateTime? LastLearned { get; set; }
        string LastLearnMode { get; set; }
        bool IsInLearnMode { get; set; }
        int ViewCount { get; set; }
    }
}