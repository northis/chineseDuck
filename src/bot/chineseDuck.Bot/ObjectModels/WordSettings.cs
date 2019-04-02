using ChineseDuck.Bot.Enums;

namespace ChineseDuck.Bot.ObjectModels
{
    public class WordSettings
    {
        public long UserId { get; set; }
        public ELearnMode LearnMode { get; set; }
        public ushort PollAnswersCount { get; set; }
    }
}