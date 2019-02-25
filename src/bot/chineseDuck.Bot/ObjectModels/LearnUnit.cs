namespace ChineseDuck.Bot.ObjectModels
{
    public sealed class LearnUnit
    {
        public string[] Options { get; set; }
        public GenerateImageResult Picture { get; set; }

        public string WordStatistic { get; set; }
        public long? IdWord { get; set; }
    }
}