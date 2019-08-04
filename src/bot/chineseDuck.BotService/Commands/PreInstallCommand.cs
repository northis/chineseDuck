using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class PreInstallCommand : CommandBase
    {
        private readonly HashSet<string> _presets;
        private const string Extension = ".csv";

        public PreInstallCommand(string preInstalledFolderPath)
        {
            var filePaths = Directory.GetFiles(preInstalledFolderPath);

            var files = new List<string>();
            foreach (var filePath in filePaths)
            {
                if(!filePath.EndsWith(Extension) || !File.Exists(filePath))
                    continue;

                var fileName = Path.GetFileNameWithoutExtension(filePath);
                files.Add(fileName);
            }

            _presets = new HashSet<string>(files.OrderBy(a => a));
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
            var answerItem = new AnswerItem();
            if (string.IsNullOrEmpty(mItem.TextOnly))
            {
                answerItem.Message ="Available pre-installed word folders:";
                var buttonRows = _presets.Select(a => new[]
                {
                    new InlineKeyboardButton
                    {
                        Text = a,
                        CallbackData = a
                    }
                });

                answerItem.Markup = new InlineKeyboardMarkup(buttonRows);
            }
            else
            {
                // Load from file and push to the store
            }

            return answerItem;
        }
    }
}