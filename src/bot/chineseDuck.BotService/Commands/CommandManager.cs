using System;
using System.Collections.Generic;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;

namespace chineseDuck.BotService.Commands
{
    public class CommandManager : ICommandManager
    {
        private readonly Func<CommandBase[]> _getCommands;
        private readonly Func<CommandBase[]> _getHiddenCommands;
        private readonly Dictionary<string, ECommands> _hiddenCommandsMapping;
        private Dictionary<ECommands, CommandBase> _commandHandlers;

        public Dictionary<ECommands, CommandBase> CommandHandlers
        {
            get
            {
                if (_commandHandlers == null)
                {
                    _commandHandlers = new Dictionary<ECommands, CommandBase>(_getCommands()
                        .OrderBy(a => a.GetCommandTypeString())
                        .ToDictionary(a => a.GetCommandType(), a => a));

                    foreach (var hiddenCommand in _getHiddenCommands())
                    {
                        CommandHandlers.Add(hiddenCommand.GetCommandType(), hiddenCommand);
                    }
                }
                return _commandHandlers;
            }
        }

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
            _getCommands = getCommands;
            _getHiddenCommands = getHiddenCommands;
            _hiddenCommandsMapping = hiddenCommandsMapping;
        }
    }
}