using System.Collections.Generic;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;

namespace chineseDuck.BotService.Commands
{
    public interface ICommandManager
    {
        Dictionary<ECommands, CommandBase> CommandHandlers { get; }

        CommandBase GetCommandHandler(string command);
    }
}