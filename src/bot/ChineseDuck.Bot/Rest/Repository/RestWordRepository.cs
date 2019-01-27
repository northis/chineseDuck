using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
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

        public void SetScore(IScore score)
        {
            throw new NotImplementedException();
        }

        public void SetUserCommand(long userId, string command)
        {
            var user = _userApi.GetUserById(userId);
            user.LastCommand = command;
            _userApi.UpdateUser(userId, user);
        }
        
        public IScore GetScore(long idUser, long idWord)
        {
            //var score = _context.Scores.FirstOrDefault(a => a.IdUser == idUser && a.IdWord == idWord);

            //if (score != null)
            //    return score;

            //var user = _context.Users.FirstOrDefault(a => a.IdUser == idUser);
            //var word = _context.Words.FirstOrDefault(a => a.Id == idWord);

            //if (user == null || word == null)
                return null;

            //score = new Score
            //{
            //    User = user,
            //    Word = word,
            //    LastView = GetRepositoryTime(),
            //    LastLearnMode = ELearnMode.FullView.ToString(),
            //    IsInLearnMode = false,
            //    OriginalWordCount = 0,
            //    OriginalWordSuccessCount = 0,
            //    PronunciationCount = 0,
            //    PronunciationSuccessCount = 0,
            //    TranslationCount = 0,
            //    TranslationSuccessCount = 0,
            //    ViewCount = 0
            //};
            //_context.Scores.Add(score);
            //_context.SaveChanges();

            //return score;
        }

        public LearnUnit GetNextWord(WordSettings settings)
        {
            var userId = settings.UserId;
            var learnMode = settings.LearnMode;
            var strategy = GetLearnMode(userId);
            var pollAnswersCount = settings.PollAnswersCount;


            IWord word = null;
            if (word == null)
                throw new Exception($"No suitable words to learn. userId={userId}");

            var wordId = word.Id;
            var score = GetScore(userId, wordId);

            //foreach (var sc in scores)
            //    sc.IsInLearnMode = false;

            //score.LastLearnMode = learnMode.ToString();
            //score.IsInLearnMode = learnMode != ELearnMode.FullView;
            //score.LastLearned = GetRepositoryTime();

            //var answers =
            //    userWords.Where(a => a.SyllablesCount == word.SyllablesCount && a.Id != wordId)
            //        .Take(pollAnswersCount - 1)
            //        .Concat(userWords.Where(a => a.Id == wordId).Take(1))
            //        .OrderBy(a => Guid.NewGuid());

            var questionItem = new LearnUnit();

            //switch (learnMode)
            //{
            //    case ELearnMode.OriginalWord:
            //        questionItem.Options = answers.Select(a => a.OriginalWord).ToArray();
            //        questionItem.Picture = word.CardOriginalWord;
            //        break;

            //    case ELearnMode.Pronunciation:
            //        questionItem.Options = answers.Select(a => a.Pronunciation).ToArray();
            //        questionItem.Picture = word.CardPronunciation;
            //        break;

            //    case ELearnMode.Translation:
            //        questionItem.Options = answers.Select(a => a.Translation).ToArray();
            //        questionItem.Picture = word.CardTranslation;
            //        break;

            //    case ELearnMode.FullView:
            //        if (score.ViewCount == null)
            //            score.ViewCount = 0;

            //        score.ViewCount++;
            //        questionItem.Options = new string[0];
            //        questionItem.Picture = word.CardAll;
            //        questionItem.WordStatistic = GetUserWordStatistic(userId, wordId).ToString();
            //        questionItem.IdWord = wordId;
            //        break;
            //}

            //_context.SaveChanges();


            return questionItem;
        }

        public IWord GetCurrentWord(long userId)
        {
            var word = _wordApi.GetCurrentWord(userId);
            return word;
        }
    }
}
