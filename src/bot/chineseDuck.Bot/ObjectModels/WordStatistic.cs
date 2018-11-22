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
                $"🖌{Score.OriginalWordSuccessCount ?? 0}/{Score.OriginalWordCount ?? 0}, 📢{Score.PronunciationSuccessCount ?? 0}/{Score.PronunciationCount ?? 0}, 🇨🇳{Score.TranslationSuccessCount ?? 0}/{Score.TranslationCount ?? 0}, 👀{Score.ViewCount}";
        }
    }
}