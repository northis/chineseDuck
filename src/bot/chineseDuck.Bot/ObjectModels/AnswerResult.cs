using ChineseDuck.Bot.Interfaces.Data;

namespace ChineseDuck.Bot.ObjectModels
{
    public class AnswerResult
    {
        public bool Success { get; set; }

        public IWord WordStatistic { get; set; }
        public byte[] Picture { get; set; }
    }
}