using chineseDuck.Bot.Security;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class WebCommand : CommandBase
    {
        private readonly AuthSigner _authSigner;
        private readonly string _baseWebPath;

        public WebCommand(AuthSigner authSigner, string baseWebPath)
        {
            _authSigner = authSigner;
            _baseWebPath = baseWebPath;
        }

        public override string GetCommandIconUnicode()
        {
            return "🌐";
        }

        public override string GetCommandTextDescription()
        {
            return "Manage the web-part of the bot";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Web;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            return new AnswerItem
            {
                Message = "You can enter to web-part here. Use this option in case of blocking Telegram.",
                Markup = new InlineKeyboardMarkup(new[]
                {
                    new[]
                    {
                        new InlineKeyboardButton
                        {
                            Text = "‍➜ Web-part login",
                            Url = _baseWebPath + _authSigner.GetAuthUrl(mItem.ChatId.ToString())
                        }
                    },
                })
            };
        }
    }
}