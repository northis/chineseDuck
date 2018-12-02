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
            LocalPort = int.Parse(configuration["LocalPort"]);
            Singleton = this;
        }

        #region Properties
        public string TelegramBotKey { get; }
        public TimeSpan PollingTimeout { get; }
        public string WebhookUrl{ get; }
        public string WebhookPublicUrl { get; }
        public int LocalPort { get; }

        public static BotSettingHolder Singleton { get; private set; }
        #endregion
    }
}