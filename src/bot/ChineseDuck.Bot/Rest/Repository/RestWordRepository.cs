using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.Rest.Api;

namespace ChineseDuck.Bot.Rest.Repository
{
    public class RestWordRepository : IWordRepository
    {
        public IWordApi WordApi { get; }
        public IUserApi UserApi { get; }
        public IServiceApi ServiceApi { get; }
        public IFolderApi FolderApi { get; }

        public RestWordRepository(IWordApi wordApi, IUserApi userApi, IServiceApi serviceApi, IFolderApi folderApi)
        {
            WordApi = wordApi;
            UserApi = userApi;
            ServiceApi = serviceApi;
            FolderApi = folderApi;
        }

        public void AddUser(IUser user)
        {
            throw new NotImplementedException();
        }

        public void AddWord(IWord word, long idUser)
        {
            throw new NotImplementedException();
        }

        public void DeleteWord(long wordId)
        {
            throw new NotImplementedException();
        }

        public void EditWord(IWord word)
        {
            throw new NotImplementedException();
        }

        public IQueryable<WordSearchResult> FindFlashCard(string searchString, long userId)
        {
            throw new NotImplementedException();
        }

        public WordStatistic GetCurrentUserWordStatistic(long userId)
        {
            throw new NotImplementedException();
        }

        public IQueryable<WordSearchResult> GetLastWords(long idUser, int topCount)
        {
            throw new NotImplementedException();
        }

        public EGettingWordsStrategy GetLearnMode(long userId)
        {
            throw new NotImplementedException();
        }

        public LearnUnit GetNextWord(WordSettings settings)
        {
            throw new NotImplementedException();
        }

        public DateTime GetRepositoryTime()
        {
            throw new NotImplementedException();
        }

        public string GetUserCommand(long userId)
        {
            throw new NotImplementedException();
        }

        public IQueryable<IUser> GetUsers()
        {
            throw new NotImplementedException();
        }

        public WordStatistic GetUserWordStatistic(long userId, long wordId)
        {
            throw new NotImplementedException();
        }

        public IWord GetWord(string wordOriginal)
        {
            throw new NotImplementedException();
        }

        public byte[] GetWordFlashCard(long fileId)
        {
            throw new NotImplementedException();
        }

        public bool IsUserExist(long userId)
        {
            throw new NotImplementedException();
        }
        
        public void RemoveUser(long userId)
        {
            throw new NotImplementedException();
        }

        public void SetLearnMode(long userId, EGettingWordsStrategy mode)
        {
            throw new NotImplementedException();
        }

        public void SetScore(IScore score)
        {
            throw new NotImplementedException();
        }

        public void SetUserCommand(long userId, string command)
        {
            throw new NotImplementedException();
        }
    }
}
