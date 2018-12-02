using ChineseDuck.BotService.Root;
using Microsoft.AspNetCore.Mvc;

namespace ChineseDuck.BotService.Helpers
{
    public class WebhookAttribute : RouteAttribute
    {
        public WebhookAttribute() : base($"{BotSettingHolder.Singleton.TelegramBotKey}/Webhook")
        {
        }
    }
}
