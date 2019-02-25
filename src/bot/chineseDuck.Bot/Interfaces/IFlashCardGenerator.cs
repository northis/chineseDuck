using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IFlashCardGenerator
    {
        GenerateImageResult Generate(IWord word, ELearnMode learnMode);
    }
}