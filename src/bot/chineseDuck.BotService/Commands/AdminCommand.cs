using System.IO;
using System.Linq;
using System.Text;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class AdminCommand : ImportCommand
    {
        private readonly IWordRepository _repository;
        private readonly IChineseWordParseProvider _parseProvider;
        private readonly string _preInstalledFolderPath;
        private readonly long _serverUserId;
        private readonly long _adminUser;
        private const string Extension = ".csv";

        public AdminCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator, uint maxImportFileSize, string preInstalledFolderPath,
            long serverUserId, long adminUser) : base(
            parseProvider, repository, flashCardGenerator, maxImportFileSize)
        {
            _repository = repository;
            _preInstalledFolderPath = preInstalledFolderPath;
            _serverUserId = serverUserId;
            _adminUser = adminUser;
            _parseProvider = parseProvider;
        }

        public override string GetCommandIconUnicode()
        {
            return "☈";
        }

        public override string GetCommandTextDescription()
        {
            return "Do some stuff here";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Admin;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            if (mItem.UserId != _adminUser)
            {
                return new AnswerItem { Message = "Access denied." };
            }

            var serviceFolders = _repository.GetUserFolders(_serverUserId);

            var filePaths = Directory.GetFiles(_preInstalledFolderPath);
            var resultString = new StringBuilder();

            foreach (var filePath in filePaths.OrderBy(a => a))
            {
                if (!filePath.EndsWith(Extension) || !File.Exists(filePath))
                    continue;

                var fileName = Path.GetFileNameWithoutExtension(filePath);
                var serviceFolder = serviceFolders.FirstOrDefault(a => a.Name == fileName);
                if (serviceFolder != null)
                {
                    _repository.DeleteFolder(serviceFolder.Id);
                }
                
                var fileBody = File.ReadAllBytes(filePath);

                var lines = BytesToLines(fileBody);
                var result = _parseProvider.ImportWords(lines);

                //OwnerId will be taken from cookies, so we may not to specify it here
                var idFolder = _repository.AddFolder(new Folder { Name = fileName, OwnerId = _serverUserId });
                _repository.SetCurrentFolder(_serverUserId, idFolder);
                var uploadWords = UploadWords(result, _serverUserId);

                resultString.AppendLine(uploadWords.SuccessfulWords.Any()
                    ? $"Words from folder {fileName} have been added."
                    : $"Can't add words to {fileName} folder.");
            }

            return new AnswerItem {Message = resultString.ToString()};
        }
    }
}