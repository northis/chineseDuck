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
            var param = mItem.TextOnly;

            // Get templates from the rep
            //if (_presets.TryGetValue(param, out var preset))
            //{
            //}
            //else
            //{
            //    answerItem.Message = "Available pre-installed word folders:";
            //    var buttonRows = _presets.Select(a => new[]
            //    {
            //        new InlineKeyboardButton
            //        {
            //            Text = a.Key,
            //            CallbackData = a.Key
            //        }
            //    });

            //    answerItem.Markup = new InlineKeyboardMarkup(buttonRows);
            //}
            return answerItem;
        }
    }
}