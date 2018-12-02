using System;
using System.Linq;
using ChineseDuck.BotService.Commands.Common;
using ChineseDuck.BotService.MainExecution;
using ChineseDuck.WebBot.Commands.Common;
using ChineseDuck.WebBot.Commands.Enums;

namespace ChineseDuck.WebBot.Commands
{
    public class HelpCommand : CommandBase
    {
        public HelpCommand(Func<CommandBase[]> getAllComands)
        {
            GetAllComands = getAllComands;
        }

        protected Func<CommandBase[]> GetAllComands { get; }

        public override string GetCommandIconUnicode()
        {
            return "❓";
        }

        public override string GetCommandTextDescription()
        {
            return "List of available commands";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Help;
        }

        public virtual string GetHelpMessage()
        {
            return string.Join(Environment.NewLine, GetAllComands().Select(a => a.GetFormattedDescription()));
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            return new AnswerItem
            {
                Message = GetHelpMessage()
            };
        }
    }
}