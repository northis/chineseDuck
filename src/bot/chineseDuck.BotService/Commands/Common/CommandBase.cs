using System;
using ChineseDuck.BotService.MainExecution;
using ChineseDuck.WebBot.Commands.Common;
using ChineseDuck.WebBot.Commands.Enums;

namespace ChineseDuck.BotService.Commands.Common
{
    public abstract class CommandBase
    {
        public const string CommandStartChar = "/";

        public string GetCommandDescription()
        {
            return GetCommandIconUnicode() + GetCommandTextDescription();
        }

        public abstract string GetCommandIconUnicode();
        public abstract string GetCommandTextDescription();
        public abstract ECommands GetCommandType();

        public static ECommands GetCommandType(string command)
        {
            if (string.IsNullOrWhiteSpace(command))
                throw new ArgumentNullException(nameof(command), "A command cannot be empty");

            if (!command.StartsWith(CommandStartChar))
                throw new ArgumentException($"A command must starts with '{CommandStartChar}'", nameof(command));

            var cleanedCommand = command.Substring(1, command.Length - 1);

            if (!Enum.TryParse(cleanedCommand, true, out ECommands commandEnum))
                throw new NotSupportedException($"Command '{nameof(command)}' is not supported");

            return commandEnum;
        }

        public string GetFormattedDescription()
        {
            return $"{CommandStartChar}{GetCommandType()} - {GetCommandDescription()}";
        }

        public abstract AnswerItem Reply(MessageItem mItem);
    }
}