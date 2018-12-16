using ChineseDuck.Bot.Interfaces.Data;

namespace ChineseDuck.Bot.ObjectModels
{
    public class WordSearchResult
    {
        public string OriginalWord { get; set; }
        public string Pronunciation { get; set; }
        public string Translation { get; set; }
        public IWordFile File { get; set; }
    }
}