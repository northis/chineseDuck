using System;
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

            userApi.LoginUser(new ApiUser{ Code = password, Id = userId });

            using (var context = new LearnChineseContext(connectionString))
            {
                var users = context.User.ToArray();

                foreach (var user in users)
                {
                    try
                    {
                        userApi.CreateUser(new User
                        {
                            CurrentFolderId = 0, IdUser = user.IdUser, Name = user.Name, JoinDate = user.JoinDate,
                            LastCommand = user.LastCommand, Mode = user.Mode, Who = RightEnum.Write
                        });
                        Console.WriteLine($"{user.IdUser} {user.Name} - user is added");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{user.IdUser} {user.Name} - user is not added: Error {ex.Message}");
                    }
                }
            }
            Console.ReadKey();
        }
    }
}
