using System;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IWordRepository
    {
        void AddUser(IUser user);

        void AddWord(IWord word, long idUser);

        void DeleteWord(long wordId);

        void EditWord(IWord word);

        WordSearchResult[] FindFlashCard(string searchString, long userId);
        
        WordSearchResult[] GetLastWords(long idUser, int topCount);

        EGettingWordsStrategy GetLearnMode(long userId);

        LearnUnit GetNextWord(WordSettings settings);

        DateTime GetRepositoryTime();

        string GetUserCommand(long userId);
        
        WordStatistic GetUserWordStatistic(long userId, long wordId);

        IWord GetWord(string wordOriginal);

        byte[] GetWordFlashCard(long fileId);

        bool IsUserExist(long userId);
        
        void RemoveUser(long userId);

        void SetLearnMode(long userId, EGettingWordsStrategy mode);

        void SetScore(IScore score);

        void SetUserCommand(long userId, string command);
    }
}