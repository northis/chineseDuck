using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class PreInstallCommand : CommandBase
    {
        private readonly IWordRepository _repository;

        public PreInstallCommand(IWordRepository repository)
        {
            _repository = repository;
        }

        public override string GetCommandIconUnicode()
        {
            return "🗀🕮";
        }

        public override string GetCommandTextDescription()
        {
            return "Get pre-installed folders";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.PreInstall;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            var answerItem = new AnswerItem();
            var text = mItem.TextOnly;

            long.TryParse(text, out var selectedFolder);
            if (selectedFolder == 0)
            {
                var folders = _repository.GetTemplateFolders();
                answerItem.Message = "Available pre-installed word folders:";
                var buttonRows = folders.Select(a => new[]
                {
                    new InlineKeyboardButton
                    {
                        Text = a.Name,
                        CallbackData = a.Id.ToString()
                    }
                });

                answerItem.Markup = new InlineKeyboardMarkup(buttonRows);
            }
            else
            {
                _repository.SetTemplateFolder(mItem.ChatId, new [] {selectedFolder});
            }
            return answerItem;
        }
    }
}