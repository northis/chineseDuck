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
        private readonly IWordApi _wordApi;
        private readonly IUserApi _userApi;
        private readonly IServiceApi _serviceApi;
        private readonly IFolderApi _folderApi;

        public RestWordRepository(IWordApi wordApi, IUserApi userApi, IServiceApi serviceApi, IFolderApi folderApi)
        {
            _wordApi = wordApi;
            _userApi = userApi;
            _serviceApi = serviceApi;
            _folderApi = folderApi;
        }

        public void AddUser(IUser user)
        {
            _userApi.CreateUser(user);
        }

        public void AddWord(IWord word, long idUser)
        {
            word.OwnerId = idUser;
            _wordApi.AddWord(word);
        }

        public void DeleteWord(long wordId)
        {
            _wordApi.DeleteWord(wordId);
        }

        public void EditWord(IWord word)
        {
            _wordApi.UpdateWord(word);
        }

        public WordSearchResult[] FindFlashCard(string searchString, long userId)
        {
            return _wordApi.GetWordsByUser(searchString, userId).Select(a => new WordSearchResult
            {
                OriginalWord = a.OriginalWord,
                Pronunciation = a.Pronunciation,
                Translation = a.Translation,
                File = a.CardAll
            }).ToArray();
        }

        public WordSearchResult[] GetLastWords(long idUser, int topCount)
        {
            var user = _userApi.GetUserById(idUser);

            if (user == null)
            {
                return null;
            }

            return _wordApi.GetWordsFolderId(user.CurrentFolderId, topCount).Select(a => new WordSearchResult
            {
                OriginalWord = a.OriginalWord,
                Pronunciation = a.Pronunciation,
                Translation = a.Translation,
                File = a.CardAll
            }).ToArray();
        }

        public EGettingWordsStrategy GetLearnMode(long userId)
        {
            var user = _userApi.GetUserById(userId);

            return user != null ? Enum.Parse<EGettingWordsStrategy>(user.Mode) : EGettingWordsStrategy.NewFirst;
        }

        public DateTime GetRepositoryTime()
        {
            return _serviceApi.GetDatetime() ?? DateTime.Now;
        }

        public string GetUserCommand(long userId)
        {
            var user = _userApi.GetUserById(userId);
            return user != null ? user.LastCommand : string.Empty;
        }

        public IWord GetWord(long wordId)
        {
            var word = _wordApi.GetWordId(wordId);
            return word;
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
