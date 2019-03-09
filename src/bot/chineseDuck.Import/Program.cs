using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using Microsoft.Extensions.Configuration;

namespace ChineseDuck.Import
{
    class Program
    {
        private const string PasswordKey = "password";
        private const string UserIdKey = "userId";
        private const string OldSqlDbKey = "OldSqlDb";
        private const string NewWebApiKey = "NewWebApi";

        static void Main()
        {
            var configurationRoot = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var password = configurationRoot[PasswordKey];
            var userId = configurationRoot[UserIdKey];
            var connectionString = configurationRoot[OldSqlDbKey];
            var site = configurationRoot[NewWebApiKey];

            var apiClient = new ApiClient(site);
            var userApi = new UserApi(apiClient);
            var wordApi = new WordApi(apiClient);
            var serviceApi = new ServiceApi(apiClient);
            var datetime = serviceApi.GetDatetime() ?? DateTime.Now;

            userApi.LoginUser(new ApiUser{ Code = password, Id = userId });

            using (var context = new LearnChineseContext(connectionString))
            {
                var users = context.User;

                var usersCount = 0;
                foreach (var user in users)
                {
                    try
                    {
                        userApi.CreateUser(new User
                        {
                            CurrentFolderId = 0,
                            CurrentWordId = context.Score.Where(a => a.IdUser == user.IdUser && a.IsInLearnMode)
                                .Select(a => a.IdWord).FirstOrDefault(),
                            IdUser = user.IdUser,
                            Name = user.Name,
                            JoinDate = user.JoinDate,
                            LastCommand = user.LastCommand,
                            Mode = user.Mode,
                            Who = RightEnum.Write
                        });
                        usersCount++;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{user.IdUser} {user.Name} - user is not added: Error {ex.Message}");
                    }
                }
                Console.WriteLine($"User count is {usersCount}");

                var words = context.Word;

                var wordsCount = 0;
                foreach (var word in words)
                {
                    try
                    {
                        var score = context.Score.FirstOrDefault(a => a.IdWord == word.Id);

                        var scoreApi = new Score { Name = string.Empty };
                        if (score == null)
                        {
                            scoreApi.LastView = datetime;
                            scoreApi.LastLearned = null;
                            scoreApi.OriginalWordCount = 0;
                            scoreApi.OriginalWordSuccessCount = 0;
                            scoreApi.PronunciationCount = 0;
                            scoreApi.PronunciationSuccessCount = 0;
                            scoreApi.TranslationCount = 0;
                            scoreApi.TranslationSuccessCount = 0;
                            scoreApi.RightAnswerNumber = null;
                            scoreApi.ViewCount = 0;
                        }
                        else
                        {
                            scoreApi.LastView = score.LastView;
                            scoreApi.LastLearned = score.LastLearned;
                            scoreApi.LastLearnMode = score.LastLearnMode;

                            scoreApi.OriginalWordCount = score.OriginalWordCount ?? 0;
                            scoreApi.OriginalWordSuccessCount = score.OriginalWordSuccessCount ?? 0;
                            scoreApi.PronunciationCount = score.PronunciationCount ?? 0;
                            scoreApi.PronunciationSuccessCount = score.PronunciationSuccessCount ?? 0;
                            scoreApi.TranslationCount = score.TranslationCount ?? 0;
                            scoreApi.TranslationSuccessCount = score.TranslationSuccessCount ?? 0;

                            scoreApi.RightAnswerNumber = score.RightAnswerNumber;
                            scoreApi.ViewCount = score.ViewCount ?? 0;
                        }

                        var fileA = context.WordFileA.FirstOrDefault(a=>a.IdWord == word.Id);
                        var fileO = context.WordFileO.FirstOrDefault(a => a.IdWord == word.Id);
                        var fileP = context.WordFileP.FirstOrDefault(a => a.IdWord == word.Id);
                        var fileT = context.WordFileT.FirstOrDefault(a => a.IdWord == word.Id);

                        if (fileA == null || fileO == null || fileP == null || fileT == null)
                        {
                            Console.WriteLine($"{word.OriginalWord} - word is not added: file is null");
                            continue;
                        }

                        var fileAId = wordApi.AddFile(new WordFileBytes {Bytes = fileA.Bytes});
                        var fileOId = wordApi.AddFile(new WordFileBytes { Bytes = fileO.Bytes });
                        var filePId = wordApi.AddFile(new WordFileBytes { Bytes = fileP.Bytes });
                        var fileTId = wordApi.AddFile(new WordFileBytes { Bytes = fileT.Bytes });

                        wordApi.AddWord(new Word
                        {
                            FolderId = 0, LastModified = word.LastModified, OwnerId = word.IdOwner,
                            OriginalWord = word.OriginalWord, Pronunciation = word.Pronunciation,
                            SyllablesCount = word.SyllablesCount, Translation = word.Translation, Usage = word.Usage,
                            Score = scoreApi,
                            CardAll = new WordFile
                            {
                                CreateDate = fileA.CreateDate, Height = fileA.Height ?? 0, Width = fileA.Width ?? 0,
                                Id = fileAId
                            },
                            CardOriginalWord = new WordFile
                            {
                                CreateDate = fileO.CreateDate, Height = fileO.Height ?? 0, Width = fileO.Width ?? 0,
                                Id = fileOId
                            },
                            CardPronunciation = new WordFile
                            {
                                CreateDate = fileP.CreateDate, Height = fileP.Height ?? 0, Width = fileP.Width ?? 0,
                                Id = filePId
                            },
                            CardTranslation = new WordFile
                            {
                                CreateDate = fileT.CreateDate, Height = fileT.Height ?? 0, Width = fileT.Width ?? 0,
                                Id = fileTId
                            }
                        });
                        wordsCount++;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{word.OriginalWord} - word is not added: Error {ex.Message}");
                    }
                }
                Console.WriteLine($"Word count is {wordsCount}");
            }
            Console.ReadKey();
        }
    }
}
