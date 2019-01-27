using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.Common;
using NUnit.Framework;

namespace ChineseDuck.Bot.Tests
{
    public class RepositoryTest
    {
        private const string PasswordKey = "--password=";
        private const string UserIdKey = "--userId=";
        private const string WebApiKey = "--WebApi=";

        public string Password => CommandLineHelper.GetParameter(PasswordKey);
        public string UserId => CommandLineHelper.GetParameter(UserIdKey);
        public string WebApi => CommandLineHelper.GetParameter(WebApiKey);

        [Test]
        public void AnswerPollTest()
        {
            var apiClient = new ApiClient(WebApi);
            var userApi = new UserApi(apiClient);
            var wordApi = new WordApi(apiClient);

            userApi.LoginUser(new ApiUser { Code = Password, Id = UserId });
        }
    }
}