using System;
using System.Diagnostics;
using System.Reflection;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class AboutCommand : CommandBase
    {
        private readonly string _releaseNotes;

        public AboutCommand(string releaseNotes)
        {
            _releaseNotes = releaseNotes;
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
            var copywrite = "0";
            var version = "0";

            var assembly = Assembly.GetExecutingAssembly();
            if (assembly.Location != null)
            {
                var fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
                copywrite = fvi.LegalCopyright;
                version = fvi.ProductVersion;
            }

            return new AnswerItem
            {
                Message =
                    $"Chinese Duck Bot ver. {version}{Environment.NewLine}{copywrite}{Environment.NewLine}Contact me: @DeathWhinny{Environment.NewLine}Rate me: http://bit.ly/2pWjKuc {Environment.NewLine}{_releaseNotes}",
                Markup = new ReplyKeyboardRemove()
            };
        }
    }
}