using System.Collections.Generic;
using System.IO;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class PreInstallCommand : ImportCommand
    {
        private readonly IChineseWordParseProvider _parseProvider;
        private readonly IWordRepository _repository;
        private readonly long _serverUserId;
        private readonly Dictionary<string, byte[]> _presets = new Dictionary<string, byte[]>();
        private const string Extension = ".csv";

        public PreInstallCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator, uint maxImportFileSize, string preInstalledFolderPath, long serverUserId) : base(
            parseProvider, repository, flashCardGenerator, maxImportFileSize)
        {
            _parseProvider = parseProvider;
            _repository = repository;
            _serverUserId = serverUserId;
            var filePaths = Directory.GetFiles(preInstalledFolderPath);

            foreach (var filePath in filePaths.OrderBy(a => a))
            {
                if (!filePath.EndsWith(Extension) || !File.Exists(filePath))
                    continue;

                var fileName = Path.GetFileNameWithoutExtension(filePath);
                var fileBody = File.ReadAllBytes(filePath);
                _presets.Add(fileName, fileBody);
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
            var answerItem = new AnswerItem();
            var param = mItem.TextOnly;

            if (_presets.TryGetValue(param, out var preset))
            {
                var lines = BytesToLines(preset);
                var result = _parseProvider.ImportWords(lines, false);
                // use ServiceCommandPassword param to close access
                // refresh the template folders = delete+re-creation
                // and move the rest of the command to another.

                var idFolder = _repository.AddFolder(new Folder {Name = param, OwnerId = _serverUserId });
                _repository.SetCurrentFolder(_serverUserId, idFolder);

                var uploadWords = UploadWords(result, _serverUserId);

                answerItem.Message = uploadWords.SuccessfulWords.Any()
                    ? $"Folder {preset} has been added."
                    : $"Can't add {preset} folder.";
            }
            else
            {
                answerItem.Message = "Available pre-installed word folders:";
                var buttonRows = _presets.Select(a => new[]
                {
                    new InlineKeyboardButton
                    {
                        Text = a.Key,
                        CallbackData = a.Key
                    }
                });

                answerItem.Markup = new InlineKeyboardMarkup(buttonRows);
            }
            return answerItem;
        }
    }
}