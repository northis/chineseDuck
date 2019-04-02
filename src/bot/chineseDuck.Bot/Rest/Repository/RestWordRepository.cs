using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Model;

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
            var user = _userApi.GetUserById(idUser);
            word.FolderId = user.CurrentFolderId;
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

            return _wordApi.GetWordsFolderId(user.CurrentFolderId, idUser, topCount).Select(a => new WordSearchResult
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

        public IUser GetUser(long userId)
        {
            var user = _userApi.GetUserById(userId);
            return user;
        }

        public IWord GetWord(string wordOriginal, long userId)
        {
            var word = _wordApi.GetWordsByUser(wordOriginal, userId).FirstOrDefault();
            return word;
        }

        public byte[] GetWordFlashCard(string fileId)
        {
            var bytes = _wordApi.GetWordCard(fileId);
            return bytes;
        }

        public bool IsUserExist(long userId)
        {
            var user = _userApi.GetUserById(userId);
            return user != null;
        }
        
        public void RemoveUser(long userId)
        {
            _userApi.DeleteUser(userId);
        }

        public void SetLearnMode(long userId, EGettingWordsStrategy mode)
        {
            var user = _userApi.GetUserById(userId);
            user.Mode = mode.ToString();
            _userApi.UpdateUser(userId, user);
        }

        public void SetScore(long wordId, IScore score)
        {
            _wordApi.ScoreWord(wordId,score);
        }

        public void SetUserCommand(long userId, string command)
        {
            var user = _userApi.GetUserById(userId);
            user.LastCommand = command;
            _userApi.UpdateUser(userId, user);
        }

        public LearnUnit GetNextWord(WordSettings settings)
        {
            var userId = settings.UserId;
            var learnMode = settings.LearnMode;

            var word = _wordApi.SetQuestionByUser(userId, learnMode);
            if (word == null)
                throw new Exception($"No suitable words to learn. userId={userId}");

            var answers = _wordApi.GetAnswersByUser(userId);
            var questionItem = new LearnUnit();

            IWordFile file;

            switch (learnMode)
            {
                case ELearnMode.OriginalWord:
                    questionItem.Options = answers.Select(a => a.OriginalWord).ToArray();
                    file = word.CardOriginalWord;
                    break;

                case ELearnMode.Pronunciation:
                    questionItem.Options = answers.Select(a => a.Pronunciation).ToArray();
                    file = word.CardPronunciation;
                    break;

                case ELearnMode.Translation:
                    questionItem.Options = answers.Select(a => a.Translation).ToArray();
                    file = word.CardTranslation;
                    break;

                default:
                    questionItem.Options = new string[0];
                    questionItem.WordStatistic = word.ToScoreString();
                    file = word.CardAll;

                    questionItem.IdWord = word.Id;
                    break;
            }

            questionItem.Picture = new GenerateImageResult
            {
                Height = file.Height,
                Width = file.Width,
                ImageBody = _wordApi.GetWordCard(file.Id)
            };

            return questionItem;
        }

        public IWord GetCurrentWord(long userId)
        {
            var word = _wordApi.GetCurrentWord(userId);
            return word;
        }

        public void SetCurrentFolder(long userId, long folderId)
        {
            var user = _userApi.GetUserById(userId);

            if (user == null)
                throw new InvalidOperationException("No user found");

            user.CurrentFolderId = folderId;
            _userApi.UpdateUser(userId, user);
        }

        public IFolder[] GetUserFolders(long userId)
        {
            return _folderApi.GetFoldersForUser(userId);
        }

        public string AddFile(byte[] bytes)
        {
            return _wordApi.AddFile(new WordFileBytes {Bytes = bytes});
        }
    }
}
