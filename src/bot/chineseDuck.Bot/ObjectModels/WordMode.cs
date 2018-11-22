using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;

namespace ChineseDuck.Bot.ObjectModels
{
    public class WordMode
    {
        public IWord Word { get; set; }
        public ELearnMode LearnMode { get; set; }
        public GenerateImageResult GenerateImageResult { get; set; }
    }
}