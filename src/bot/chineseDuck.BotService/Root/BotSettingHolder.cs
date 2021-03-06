using System;
using Microsoft.Extensions.Configuration;

namespace ChineseDuck.BotService.Root
{
    public class BotSettingHolder
    {
        public BotSettingHolder(IConfiguration configuration)
        {
            TelegramBotKey = configuration["TelegramBotKey"];
            PollingTimeout = TimeSpan.Parse(configuration["PollingTimeout"]);
            WebhookUrl = configuration["WebhookUrl"];
            WebhookPublicUrl = configuration["WebhookPublicUrl"];
            ApiPublicUrl = configuration["ApiPublicUrl"];
            LocalPort = int.Parse(configuration["LocalPort"]);
            UserId = long.Parse(configuration["UserId"]);
            AdminUserId = long.Parse(configuration["AdminUserId"]);
            ServerUserId = long.Parse(configuration["ServerUserId"]);
            ServiceCommandPassword = configuration["ServiceCommandPassword"];
            FolderManagementText = configuration["FolderManagementText"];
            Singleton = this;
        }

        #region Properties
        public string TelegramBotKey { get; }
        public TimeSpan PollingTimeout { get; }
        public string WebhookUrl{ get; }
        public string WebhookPublicUrl { get; }
        public int LocalPort { get; }
        public string ApiPublicUrl { get; }
        public long UserId { get; }
        public long AdminUserId { get; }
        public long ServerUserId { get; }
        public string ServiceCommandPassword { get; }
        public string FolderManagementText { get; }

        public static BotSettingHolder Singleton { get; private set; }
        #endregion
    }
}