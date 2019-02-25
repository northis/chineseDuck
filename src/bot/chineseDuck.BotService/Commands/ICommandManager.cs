using System.Collections.Generic;
using ChineseDuck.BotService.Commands.Common;
using ChineseDuck.WebBot.Commands.Enums;

namespace ChineseDuck.BotService.Commands
{
    public interface ICommandManager
    {
        Dictionary<ECommands, CommandBase> CommandHandlers { get; }

        CommandBase GetCommandHandler(string command);
    }
}