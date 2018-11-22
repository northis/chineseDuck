namespace ChineseDuck.Bot.ObjectModels
{
    public class WordSearchResult
    {
        public string OriginalWord { get; set; }
        public string Pronunciation { get; set; }
        public string Translation { get; set; }
        public long FileId { get; set; }
        public int? HeightFlashCard { get; set; }
        public int? WidthFlashCard { get; set; }
    }
}