using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class PreInstallCommand : CommandBase
    {
        private readonly Dictionary<string, string> _foldersDictionary = new Dictionary<string, string>();
        private const string Extension = ".csv";

        public PreInstallCommand(string preInstalledFolderPath)
        {
            var filePaths = Directory.GetFiles(preInstalledFolderPath);

            foreach (var filePath in filePaths)
            {
                if(!filePath.EndsWith(Extension))
                    continue;


            }
        }

        public override string GetCommandIconUnicode()
        {
            return "🗀🕮";
        }

        public override string GetCommandTextDescription()
        {
            return "Get pre-installed folders";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.PreInstall;
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