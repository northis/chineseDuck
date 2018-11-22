using System;
using ChineseDuck.Bot.Interfaces.Data;

namespace ChineseDuck.Bot.ObjectModels
{
    public class ScoreDto : IScore
    {
        public IWord Word { get; set; }
        public long IdUser { get; set; }
        public long IdWord { get; set; }
        public bool IsInLearnMode { get; set; }
        public DateTime? LastLearned { get; set; }
        public string LastLearnMode { get; set; }
        public DateTime LastView { get; set; }
        public int? OriginalWordCount { get; set; }
        public int? OriginalWordSuccessCount { get; set; }
        public int? PronunciationCount { get; set; }
        public int? PronunciationSuccessCount { get; set; }
        public short? RightAnswerNumber { get; set; }
        public int? TranslationCount { get; set; }
        public int? TranslationSuccessCount { get; set; }
        public int? ViewCount { get; set; }
    }
}