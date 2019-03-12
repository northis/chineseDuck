using System;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class HelpCommand : CommandBase
    {
        public HelpCommand(Func<CommandBase[]> getAllCommands)
        {
            GetAllCommands = getAllCommands;
        }

        protected Func<CommandBase[]> GetAllCommands { get; }

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
            return string.Join(Environment.NewLine, GetAllCommands().Select(a => a.GetFormattedDescription()));
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