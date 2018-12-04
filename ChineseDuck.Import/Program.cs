using System;
using System.IO;
using System.Linq;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using Microsoft.Extensions.Configuration;

namespace ChineseDuck.Import
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            var configuration = builder.Build();
            var connectionString = configuration.GetConnectionString("OldSqlDb");
            var site = configuration["NewWebApi"];

            var apiClient = new ApiClient(site);
            var serviceApi = new ServiceApi(apiClient);

            var dt = serviceApi.GetDatetime();

            using (var context = new LearnChineseContext(connectionString))
            {
                var users = context.User.ToArray();

                foreach (var user in users)
                {
                    Console.WriteLine($"{user.IdUser} - {user.Name} - {user.JoinDate}");
                }
            }
            Console.ReadKey();
        }
    }
}
