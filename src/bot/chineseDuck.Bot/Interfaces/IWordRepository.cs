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
        
        DateTime GetRepositoryTime();

        string GetUserCommand(long userId);

        IWord GetWord(long wordId);

        IWord GetWord(string wordOriginal, long userId);

        byte[] GetWordFlashCard(string fileId);

        bool IsUserExist(long userId);
        
        void RemoveUser(long userId);

        void SetLearnMode(long userId, EGettingWordsStrategy mode);

        void SetScore(long wordId, IScore score);

        void SetUserCommand(long userId, string command);

        LearnUnit GetNextWord(WordSettings settings);

        IWord GetCurrentWord(long userId);

        void SetCurrentFolder(long userId, long folderId);
        IFolder[] GetUserFolders(long userId);

        string AddFile(byte[] bytes);

        IUser GetUser(long userId);
    }
}