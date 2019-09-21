using System;
using System.Collections.Generic;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;

namespace chineseDuck.BotService.Commands
{
    public class CommandManager : ICommandManager
    {
        private readonly Dictionary<string, ECommands> _hiddenCommandsMapping;
        public Dictionary<ECommands, CommandBase> CommandHandlers { get; }

        public CommandBase GetCommandHandler(string command)
        {
            if (!_hiddenCommandsMapping.TryGetValue(command, out var commandEnum))
            {
                commandEnum = CommandBase.GetCommandType(command);
            }
            return CommandHandlers[commandEnum];
        }

        public CommandManager(Func<CommandBase[]> getCommands, Func<CommandBase[]> getHiddenCommands, Dictionary<string, ECommands> hiddenCommandsMapping)
        {
            _hiddenCommandsMapping = hiddenCommandsMapping;
            CommandHandlers = new Dictionary<ECommands, CommandBase>(getCommands()
                .OrderBy(a => a.GetCommandTypeString())
                .ToDictionary(a => a.GetCommandType(), a => a));

            foreach (var hiddenCommand in getHiddenCommands())
            {
                CommandHandlers.Add(hiddenCommand.GetCommandType(), hiddenCommand);
            }
        }
    }
}