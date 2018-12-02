using ChineseDuck.Bot.Interfaces.Data;

namespace ChineseDuck.Bot.ObjectModels
{
    public class WordStatistic
    {
        public IWord Word { get; set; }
        public IScore Score { get; set; }

        public override string ToString()
        {
            if (Score == null)
                return "0";

            return
                $"🖌{Score.OriginalWordSuccessCount}/{Score.OriginalWordCount}, 📢{Score.PronunciationSuccessCount}/{Score.PronunciationCount}, 🇨🇳{Score.TranslationSuccessCount}/{Score.TranslationCount}, 👀{Score.ViewCount}";
        }
    }
}