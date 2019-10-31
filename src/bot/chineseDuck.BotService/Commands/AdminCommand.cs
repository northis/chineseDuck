using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
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

            if (string.IsNullOrEmpty(mItem.TextOnly))
                return new AnswerItem { Message = "Give me a file name to update." };

            var fileName = mItem.Text;
            var filePath = Path.Combine(_preInstalledFolderPath, fileName);

            if (!fileName.EndsWith(Extension))
                return new AnswerItem { Message = "It is not a csv file." };
            if (!File.Exists(filePath))
                return new AnswerItem { Message = "No such file." };

            var serviceFolders = _repository.GetUserFolders(_serverUserId);

            ThreadPool.QueueUserWorkItem(cb =>
            {
                var resultString = new StringBuilder();

                fileName = Path.GetFileNameWithoutExtension(filePath);
                var serviceFolder = serviceFolders.FirstOrDefault(a => a.Name == fileName);
                if (serviceFolder != null)
                {
                    _repository.DeleteFolder(serviceFolder.Id);
                    resultString.AppendLine("Old folder was removed.");
                }

                var fileBody = File.ReadAllBytes(filePath);

                var lines = BytesToLines(fileBody);
                var result = _parseProvider.ImportWords(lines);

                //OwnerId will be taken from cookies, so we may not to specify it here
                var idFolder = _repository.AddFolder(new Folder {Name = fileName, OwnerId = _serverUserId});
                _repository.SetCurrentFolder(_serverUserId, idFolder);
                UploadWords(result, _serverUserId);
            });

            return new AnswerItem {Message ="Import is running..."};
        }
    }
}