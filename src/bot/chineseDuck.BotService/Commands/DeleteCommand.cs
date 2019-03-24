using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class DeleteCommand : CommandBase
    {
        public const string YesAnswer = "yes";
        public const string NoAnswer = "no";
        private readonly IWordRepository _repository;

        public DeleteCommand(IWordRepository repository)
        {
            _repository = repository;
        }

        public override string GetCommandIconUnicode()
        {
            return "🗑";
        }

        public override string GetCommandTextDescription()
        {
            return "Remove a word from the dictionary";
        }


        public override ECommands GetCommandType()
        {
            return ECommands.Delete;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            IReplyMarkup markup = null;

            string message;

            if (string.IsNullOrEmpty(mItem.TextOnly))
            {
                message =
                    "Type a chinese word to remove it from the dictionary. All word's score information will be removed too!";
            }
            else if (NoAnswer == mItem.TextOnly.ToLowerInvariant())
            {
                message = "Delete has been cancelled";
            }
            else if (mItem.TextOnly.ToLowerInvariant().StartsWith(YesAnswer))
            {
                try
                {
                    var wordText = mItem.TextOnly.Replace(YesAnswer, string.Empty);
                    var word = _repository.GetWord(wordText, mItem.ChatId);

                    if (word == null)
                    {
                        message = $"Word {wordText} is not found";
                    }
                    else
                    {
                        _repository.DeleteWord(word.Id);
                        message = $"Word {word.OriginalWord} has been removed";
                    }

                }
                catch (Exception e)
                {
                    message = e.Message;
                }
            }
            else
            {
                message = $"Do you really want to remove '{mItem.TextOnly}'?";

                markup = new InlineKeyboardMarkup(new[]
                {
                    new InlineKeyboardButton {Text = "✅Yes", CallbackData = $"yes{mItem.TextOnly}"},
                    new InlineKeyboardButton {Text = "❌No", CallbackData = "no"}
                });
            }

            var answer = new AnswerItem
            {
                Message = message,
                Markup = markup
            };

            return answer;
        }
    }
}