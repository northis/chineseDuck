using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using chineseDuck.BotService.Commands;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Common.Logging;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.InlineQueryResults;
using Telegram.Bot.Types.InputFiles;
using Telegram.Bot.Types.ReplyMarkups;

namespace ChineseDuck.BotService.MainExecution
{
    public class QueryHandler
    {
        private readonly AntiDdosChecker _checker;
        private readonly TelegramBotClient _client;
        private readonly string _flashCardUrl;
        private readonly ICommandManager _commandManager;
        private readonly uint _maxUploadFileSize;
        private readonly IWordRepository _repository;
        private readonly ILogService _logService;

        public int MaxInlineQueryLength = 5;
        public int MaxInlineSearchResult = 7;

        public QueryHandler(TelegramBotClient client, ILogService logService, IWordRepository repository,
            AntiDdosChecker checker, string flashCardUrl, ICommandManager commandManager, uint maxUploadFileSize)
        {
            _client = client;
            _repository = repository;
            _checker = checker;
            _flashCardUrl = flashCardUrl;
            _commandManager = commandManager;
            _maxUploadFileSize = maxUploadFileSize;
            _logService = logService;
        }

        public async Task CallbackQuery(CallbackQuery callbackQuery)
        {
            try
            {
                var userId = callbackQuery.From.Id;
                if (!_checker.AllowUser(userId))
                    return;

                await OnMessage(callbackQuery.Message, callbackQuery.Data, callbackQuery.From);

                _checker.UserQueryProcessed(userId);
            }
            catch (Exception ex)
            {
                _logService.Write("CallbackQuery", ex, null);
            }
        }

        public static string GetNoEmojiString(string str)
        {
            if (string.IsNullOrWhiteSpace(str))
                return str;

            var noEmojiStr = new StringBuilder();

            foreach (var chr in str)
            {
                var cat = char.GetUnicodeCategory(chr);

                if (cat != UnicodeCategory.OtherSymbol && cat != UnicodeCategory.Surrogate &&
                    cat != UnicodeCategory.NonSpacingMark)
                    noEmojiStr.Append(chr);
            }

            return noEmojiStr.ToString();
        }

        public async Task InlineQuery(InlineQuery inlineQuery)
        {
            var userId = inlineQuery.From.Id;
            var q = inlineQuery.Query;

            if (!_checker.AllowUser(userId))
                return;

            if (q.Length > MaxInlineQueryLength)
                return;

            if (!_repository.IsUserExist(userId))
                _repository.AddUser(new Bot.Rest.Model.User
                {
                    IdUser = userId,
                    Name = $"{inlineQuery.From.FirstName} {inlineQuery.From.LastName}",
                    Mode = EGettingWordsStrategy.Random.ToString()
                });

            WordSearchResult[] results;

            // ReSharper disable once ConvertIfStatementToConditionalTernaryExpression
            if (q.Any())
                results = _repository.FindFlashCard(q, userId).ToArray();
            else
                results = _repository.GetLastWords(userId, MaxInlineSearchResult).ToArray();

            if (!results.Any())
            {
                await _client.AnswerInlineQueryAsync(inlineQuery.Id, new InlineQueryResultBase[]
                {
                    new InlineQueryResultArticle(inlineQuery.Id, "Please, type a chinese word to view it's flashcard",
                        new InputTextMessageContent("Still can't show you a flashcard")
                        {
                            DisableWebPagePreview = true,
                            ParseMode = ParseMode.Default
                        })
                });

                _checker.UserQueryProcessed(userId);
                return;
            }


            var inlineQueryResults = results.Select(
                a =>
                    new InlineQueryResultPhoto(Guid.NewGuid().ToString(), _flashCardUrl + a.File.Id,
                        _flashCardUrl + a.File.Id)
                    {
                        Caption = a.OriginalWord,
                        PhotoHeight = a.File.Height,
                        PhotoWidth = a.File.Width
                    });


            await _client.AnswerInlineQueryAsync(inlineQuery.Id, inlineQueryResults.ToArray(), 0);
            _checker.UserQueryProcessed(userId);
        }

        public async Task OnMessage(Message msg)
        {
            try
            {
                var userId = msg.From.Id;
                if (!_checker.AllowUser(userId))
                    return;

                await OnMessage(msg, msg.Text, msg.From);

                _checker.UserQueryProcessed(userId);
            }
            catch (Exception ex)
            {
                _logService.Write("Message", ex, null);
            }
        }

        public void OnReceiveError(ApiRequestException e)
        {
            _logService.Write(nameof(OnReceiveError), e, null);
        }

        public void OnReceiveGeneralError(Exception e)
        {
            _logService.Write(nameof(OnReceiveGeneralError), e, null);
        }

        private async Task HandleArgumentCommand(Message msg, string argumentCommand, long userId)
        {
            var possiblePreviousCommand = _repository.GetUserCommand(userId);

            if (!string.IsNullOrWhiteSpace(possiblePreviousCommand))
            {
                var noEmojiCmd = GetNoEmojiString(argumentCommand) ?? string.Empty;

                var mItem = new MessageItem
                {
                    Command = possiblePreviousCommand,
                    ChatId = msg.Chat.Id,
                    UserId = msg.From.Id,
                    Text = msg.Text,
                    TextOnly = noEmojiCmd.Replace(possiblePreviousCommand, string.Empty)
                };

                try
                {
                    if (msg.Document != null)
                    {
                        if (msg.Document.FileSize <= _maxUploadFileSize)
                        {
                            var file = await _client.GetFileAsync(msg.Document.FileId);
                            mItem.Stream = new MemoryStream();
                            await _client.DownloadFileAsync(file.FilePath, mItem.Stream);
                        }
                        mItem.FileSize = msg.Document.FileSize;
                    }
                    await HandleCommand(mItem);
                }
                finally
                {
                    mItem.Stream?.Close();
                }
            }
        }

        private async Task HandleCommand(MessageItem mItem)
        {
            var handler = _commandManager.GetCommandHandler(mItem.Command);
            var reply = handler.Reply(mItem);

            if (reply.Markup == null)
                reply.Markup = new ReplyKeyboardRemove();

            if (reply.Picture == null)
            {
                await _client.SendTextMessageAsync(mItem.ChatId, reply.Message, ParseMode.Default, true, false, 0,
                    reply.Markup);
            }
            else
            {
                using (var ms = new MemoryStream(reply.Picture.ImageBody))
                {
                    await _client.SendPhotoAsync(mItem.ChatId, new InputOnlineFile(ms, "file.jpg"), reply.Message,
                        ParseMode.Default, false,
                        0, reply.Markup);
                }
            }
        }

        private async Task OnMessage(Message msg, string argumentCommand, User user)
        {
            if (!_repository.IsUserExist(user.Id))
                _repository.AddUser(new Bot.Rest.Model.User
                {
                    IdUser = user.Id,
                    Name = $"{user.FirstName} {user.LastName}",
                    Mode = EGettingWordsStrategy.Random.ToString()
                });

            var firstEntity = msg.Entities?.FirstOrDefault();
            if (firstEntity?.Type == MessageEntityType.BotCommand)
            {
                var commandOnly = msg.Text.Substring(firstEntity.Offset, firstEntity.Length);

                var noEmoji = GetNoEmojiString(msg.Text);

                var textOnly = noEmoji.Replace(commandOnly, string.Empty);
                await HandleCommand(new MessageItem
                {
                    Command = commandOnly,
                    ChatId = msg.Chat.Id,
                    UserId = user.Id,
                    Text = msg.Text,
                    TextOnly = textOnly
                });

                _repository.SetUserCommand(user.Id, commandOnly);
            }
            else
            {
                await HandleArgumentCommand(msg, argumentCommand, user.Id);
            }
        }
    }
}