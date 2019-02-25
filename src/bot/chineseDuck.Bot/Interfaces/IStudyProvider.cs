using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IStudyProvider
    {
        AnswerResult AnswerWord(long userId, string possibleAnswer);
        LearnUnit LearnWord(long userId, ELearnMode learnMode);
    }
}