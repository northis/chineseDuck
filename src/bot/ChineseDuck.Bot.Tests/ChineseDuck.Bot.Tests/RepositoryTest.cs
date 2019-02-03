using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using Microsoft.Extensions.Configuration;
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

        public string Password => _configurationRoot["TestSettings:password"];
        public string UserId => _configurationRoot["TestSettings:userId"];
        public string AdminId => _configurationRoot["TestSettings:adminId"];
        public string WebApi => _configurationRoot["TestSettings:webApi"];

        [Test]
        public void AnswerPollTest()
        {
            var apiClient = new ApiClient(WebApi);
            var userApi = new UserApi(apiClient);
            var wordApi = new WordApi(apiClient);

            userApi.LoginUser(new ApiUser { Code = Password, Id = AdminId });
            var nextWord = wordApi.SetQuestionByUser(long.Parse(UserId), ELearnMode.Translation);
        }
    }
}