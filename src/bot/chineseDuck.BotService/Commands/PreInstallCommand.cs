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
        private readonly Dictionary<string, byte[]> _presets = new Dictionary<string, byte[]>();
        private const string Extension = ".csv";

        public PreInstallCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator, uint maxImportFileSize, string preInstalledFolderPath) : base(
            parseProvider, repository, flashCardGenerator, maxImportFileSize)
        {
            _parseProvider = parseProvider;
            _repository = repository;
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

                var idFolder = _repository.AddFolder(new Folder {Name = param, OwnerId = mItem.UserId});
                _repository.SetCurrentFolder(mItem.UserId, idFolder);

                var uploadWords = UploadWords(result, mItem.UserId);

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