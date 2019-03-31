using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using chineseDuck.Bot.Security;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.Providers;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.Bot.Rest.Repository;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NUnit.Framework;

namespace ChineseDuck.Bot.Tests
{
    public class RepositoryTest
    {
        public RepositoryTest()
        {
            _configurationRoot = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
        }

        private readonly IConfigurationRoot _configurationRoot;
        private RestWordRepository _restWordRepository;
        private FolderApi _folderApi;
        private ServiceApi _serviceApi;
        private WordApi _wordApi;
        private UserApi _userApi;
        private Word[] _testWords;
        private WordFileBytes[] _testWordFileBytes;

        public string BotKey => _configurationRoot["TestSettings:botKey"];
        public string UserId => _configurationRoot["TestSettings:userId"];
        public string AdminId => _configurationRoot["TestSettings:adminId"];
        public string WebApi => _configurationRoot["TestSettings:webApi"];
        public long UserIdLong => long.Parse(UserId);
        public ushort AnswersCount => ClassicStudyProvider.PollAnswersCount;
        
        private Word[] GetTestWords()
        {
            var testWords = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "testWords.json");
            var jsonWords = File.ReadAllText(testWords);
            var words = JsonConvert.DeserializeObject<Word[]>(jsonWords);
            return words;
        }

        private WordFileBytes[] GetTestWordFileBytes()
        {
            var testFiles = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "testFiles.json");
            var jsonFiles = File.ReadAllText(testFiles);
            var files = JsonConvert.DeserializeObject<WordFileBytes[]>(jsonFiles);
            return files; 
        }

        [OneTimeSetUp]
        public void Start()
        {
            var apiClient = new ApiClient(WebApi);
            var signer = new AuthSigner(BotKey);
            _userApi = new UserApi(apiClient, signer);
            _wordApi = new WordApi(apiClient);
            _serviceApi = new ServiceApi(apiClient);
            _folderApi = new FolderApi(apiClient);

            _userApi.LoginUser(new ApiUser { Id = AdminId });
            _restWordRepository = new RestWordRepository(_wordApi, _userApi, _serviceApi, _folderApi);

            _testWords = GetTestWords();
            _testWordFileBytes = GetTestWordFileBytes();

            FillDb();
        }

        [OneTimeTearDown]
        public void CleanDb()
        {
            var user = _userApi.GetUserById(UserIdLong);
            var words = _wordApi.GetWordsFolderId(user.CurrentFolderId, UserIdLong, null);
            foreach (var testWord in words)
            {
                _wordApi.DeleteFile(testWord.CardAll.Id);
                _wordApi.DeleteFile(testWord.CardOriginalWord.Id);
                _wordApi.DeleteFile(testWord.CardPronunciation.Id);
                _wordApi.DeleteFile(testWord.CardTranslation.Id);

                _wordApi.DeleteWord(testWord.Id);
            }
        }

        private void FillDb()
        {
            var user = _userApi.GetUserById(UserIdLong);

            foreach (var testWord in _testWords)
            {
                testWord.OwnerId = UserIdLong;
                testWord.FolderId = user.CurrentFolderId;

                testWord.CardAll.Id = _wordApi.AddFile(_testWordFileBytes.First(a => a.Id == testWord.CardAll.Id));
                testWord.CardOriginalWord.Id =
                    _wordApi.AddFile(_testWordFileBytes.First(a => a.Id == testWord.CardOriginalWord.Id));
                testWord.CardTranslation.Id =
                    _wordApi.AddFile(_testWordFileBytes.First(a => a.Id == testWord.CardTranslation.Id));
                testWord.CardPronunciation.Id =
                    _wordApi.AddFile(_testWordFileBytes.First(a => a.Id == testWord.CardPronunciation.Id));

                _wordApi.AddWord(testWord);
            }
        }

        [Test]
        public void LearnWordsTest()
        {
            var word = GetWord("做客");
            var stat = word.Score.TranslationCount;
            var wordLearnUnit = GetLearnUnit(EGettingWordsStrategy.NewMostDifficult, ELearnMode.Translation);
            Assert.AreEqual(ClassicStudyProvider.PollAnswersCount, wordLearnUnit.Options.Length);
            Assert.AreEqual(1, wordLearnUnit.Options.Count(a => a == word.Translation));
            word = GetWord("做客");
            Assert.AreEqual(stat + 1, word.Score.TranslationCount);

            word = GetWord("忘");
            stat = word.Score.PronunciationCount;
            wordLearnUnit = GetLearnUnit(EGettingWordsStrategy.OldMostDifficult, ELearnMode.Pronunciation);
            Assert.AreEqual(ClassicStudyProvider.PollAnswersCount, wordLearnUnit.Options.Length);
            Assert.AreEqual(1, wordLearnUnit.Options.Count(a => a == word.Pronunciation));
            word = GetWord("忘");
            Assert.AreEqual(stat + 1, word.Score.PronunciationCount);

            word = GetWord("冰箱");
            stat = word.Score.OriginalWordCount;
            wordLearnUnit = GetLearnUnit(EGettingWordsStrategy.NewFirst, ELearnMode.OriginalWord);
            Assert.AreEqual(ClassicStudyProvider.PollAnswersCount, wordLearnUnit.Options.Length);
            Assert.AreEqual(1, wordLearnUnit.Options.Count(a => a == word.OriginalWord));
            word = GetWord("冰箱");
            Assert.AreEqual(stat + 1, word.Score.OriginalWordCount);

            word = GetWord("只有");
            stat = word.Score.ViewCount;
            wordLearnUnit = GetLearnUnit(EGettingWordsStrategy.OldFirst, ELearnMode.FullView);
            Assert.AreEqual(word.Id, wordLearnUnit.IdWord);
            word = GetWord("只有");
            Assert.AreEqual(stat + 1, word.Score.ViewCount);
        }

        LearnUnit GetLearnUnit(EGettingWordsStrategy strategy, ELearnMode mode)
        {
            var user = _userApi.GetUserById(UserIdLong);
            user.Mode = strategy.ToString();
            _userApi.UpdateUser(UserIdLong, user);

            var learnUnit = _restWordRepository.GetNextWord(new WordSettings
                { LearnMode = mode, PollAnswersCount = AnswersCount, UserId = UserIdLong });

            return learnUnit;
        }

        IWord GetWord(string original)
        {
            return _wordApi.GetWordsByUser(original, UserIdLong).First();
        }
    }
}