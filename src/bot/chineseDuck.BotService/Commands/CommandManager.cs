using System;
using System.Collections.Generic;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;

namespace chineseDuck.BotService.Commands
{
    public class CommandManager : ICommandManager
    {
        private Dictionary<ECommands, CommandBase> _commandHandlers;
        private readonly Func<CommandBase[]> _getCommands;

        public Dictionary<ECommands, CommandBase> CommandHandlers
        {
            get
            {
                return _commandHandlers ?? (_commandHandlers = _getCommands()
                           .OrderBy(a => a.GetCommandType().ToString())
                           .ToDictionary(a => a.GetCommandType(), a => a));
            }
        }

        public CommandBase GetCommandHandler(string command)
        {
            var commandEnum = CommandBase.GetCommandType(command);
            return CommandHandlers[commandEnum];
        }

        public CommandManager(Func<CommandBase[]> getCommands)
        {
            _getCommands = getCommands;
        }
    }
}
