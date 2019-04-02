using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class AboutCommand : CommandBase
    {
        private readonly string _releaseNotes;
        private readonly string _mainAboutString;

        public AboutCommand(string releaseNotes, string mainAboutString)
        {
            _releaseNotes = releaseNotes;
            _mainAboutString = mainAboutString;
        }

        public override string GetCommandIconUnicode()
        {
            return "🈴";
        }

        public override string GetCommandTextDescription()
        {
            return "About this bot";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.About;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            return new AnswerItem
            {
                Message = _mainAboutString + Environment.NewLine + _releaseNotes,
                Markup = new ReplyKeyboardRemove()
            };
        }
    }
}