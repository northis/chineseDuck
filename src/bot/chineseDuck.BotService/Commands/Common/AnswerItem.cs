using ChineseDuck.Bot.ObjectModels;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands.Common
{
    public class AnswerItem
    {
        public string Message { get; set; }

        public IReplyMarkup Markup { get; set; }

        public GenerateImageResult Picture { get; set; }
    }
}