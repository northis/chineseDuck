﻿using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;

namespace ChineseDuck.Import
{
    class Program
    {
        private const string PasswordKey = "--password=";
        private const string UserIdKey = "--userId=";
        private const string OldSqlDbKey = "--OldSqlDb=";
        private const string NewWebApiKey = "--NewWebApi=";

        private static string GetParameter(string key)
        {
            return Environment.GetCommandLineArgs().Where(a => a.StartsWith(key)).Select(a => a.Replace(key, string.Empty))
                .FirstOrDefault();
        }

        static void Main()
        {
            var password = GetParameter(PasswordKey);
            var userId = GetParameter(UserIdKey);
            var connectionString = GetParameter(OldSqlDbKey);
            var site = GetParameter(NewWebApiKey);

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
                            CurrentFolderId = 0, IdUser = user.IdUser, Name = user.Name, JoinDate = user.JoinDate,
                            LastCommand = user.LastCommand, Mode = user.Mode, Who = RightEnum.Write
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
                            scoreApi.IsInLearnMode = false;
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
                            scoreApi.IsInLearnMode = score.IsInLearnMode;
                            scoreApi.LastView = score.LastView;
                            scoreApi.LastLearned = score.LastLearned;

                            scoreApi.OriginalWordCount = score.OriginalWordCount ?? 0;
                            scoreApi.OriginalWordSuccessCount = score.OriginalWordSuccessCount ?? 0;
                            scoreApi.PronunciationCount = score.PronunciationCount ?? 0;
                            scoreApi.PronunciationSuccessCount = score.PronunciationSuccessCount ?? 0;
                            scoreApi.TranslationCount = score.TranslationCount ?? 0;
                            scoreApi.TranslationSuccessCount = score.TranslationSuccessCount ?? 0;

                            scoreApi.RightAnswerNumber = score.RightAnswerNumber;
                            scoreApi.ViewCount = score.ViewCount ?? 0;
                        }

                        var fileA = word.WordFileA;
                        var fileO = word.WordFileO;
                        var fileP = word.WordFileP;
                        var fileT = word.WordFileT;

                        if (fileA == null || fileO == null || fileP == null || fileT == null)
                        {
                            Console.WriteLine($"{word.OriginalWord} - word is not added: file is null");
                            continue;
                        }

                        // wordApi.

                        wordApi.AddWord(new Word
                        {
                            FolderId = 0, LastModified = word.LastModified, OwnerId = word.IdOwner,
                            OriginalWord = word.OriginalWord, Pronunciation = word.Pronunciation,
                            SyllablesCount = word.SyllablesCount, Translation = word.Translation, Usage = word.Usage,
                            Score = scoreApi,
                            CardAll = new WordFile
                                {CreateDate = fileA.CreateDate, Height = fileA.Height ?? 0, Width = fileA.Width ?? 0},
                            CardOriginalWord = new WordFile
                                { CreateDate = fileO.CreateDate, Height = fileO.Height ?? 0, Width = fileO.Width ?? 0 },
                            CardPronunciation = new WordFile
                                { CreateDate = fileP.CreateDate, Height = fileP.Height ?? 0, Width = fileP.Width ?? 0 },
                            CardTranslation = new WordFile
                                { CreateDate = fileT.CreateDate, Height = fileT.Height ?? 0, Width = fileT.Width ?? 0 }
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
