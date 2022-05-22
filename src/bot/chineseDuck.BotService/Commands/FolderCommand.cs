using System;
using System.Linq;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class FolderCommand : CommandBase
    {
        private readonly IWordRepository _repository;
        private readonly string _folderManageText;

        public FolderCommand(IWordRepository repository, string folderManageText)
        {
            _repository = repository;
            _folderManageText = folderManageText;
        }

        public override string GetCommandIconUnicode()
        {
            return "🗀";
        }

        public override string GetCommandTextDescription()
        {
            return "Manage your current folder";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Folder;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(mItem.TextOnly))
                {
                    var user = _repository.GetUser(mItem.ChatId);
                    var folders = _repository.GetUserFolders(mItem.ChatId);
                    var currentFolder = folders.FirstOrDefault(a => a.Id == user.CurrentFolderId) ??
                                        folders.First(a => a.Id == 0);

                    var answerItem = new AnswerItem
                    {
                        Message = $"{_folderManageText}{Environment.NewLine}Current folder is {currentFolder.Name}. You can set a new current folder:"
                    };

                    var buttonRows = folders.Select(a => new[]
                    {
                        new InlineKeyboardButton
                        {
                            Text = $"{a.Name} ({a.WordsCount})",
                            CallbackData = a.Id.ToString()
                        }
                    });

                    answerItem.Markup = new InlineKeyboardMarkup(buttonRows);
                    return answerItem;
                }

                if (!long.TryParse(mItem.TextOnly, out var folderId))
                    throw new InvalidOperationException("Wrong folder");

                _repository.SetCurrentFolder(mItem.ChatId, folderId);
            }
            catch (Exception e)
            {
                return new AnswerItem
                {
                    Message = e.Message
                };
            }

            return new AnswerItem
            {
                Message = "Folder has been set"
            };
        }

    }
}