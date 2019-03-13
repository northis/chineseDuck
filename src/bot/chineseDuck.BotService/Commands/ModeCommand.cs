using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands
{
    public class ModeCommand : CommandBase
    {
        private readonly IWordRepository _repository;

        public ModeCommand(IWordRepository repository)
        {
            _repository = repository;
        }

        public override string GetCommandIconUnicode()
        {
            return "⚙️";
        }

        public override string GetCommandTextDescription()
        {
            return "Choose learn words mode";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Mode;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            if (string.IsNullOrWhiteSpace(mItem.TextOnly))
                return new AnswerItem
                {
                    Message = "Choose learn words mode:",
                    Markup = new InlineKeyboardMarkup(new[]
                    {
                        new[]
                        {
                            new InlineKeyboardButton
                            {
                                Text = "‍Hard, old first",
                                CallbackData = EGettingWordsStrategy.OldMostDifficult.ToString()
                            }
                        },
                        new[]
                        {
                            new InlineKeyboardButton
                            {
                                Text = "‍Hard, new first",
                                CallbackData = EGettingWordsStrategy.NewMostDifficult.ToString()
                            }
                        },
                        new[]
                        {
                            new InlineKeyboardButton
                            {
                                Text = "‍New first",
                                CallbackData = EGettingWordsStrategy.NewFirst.ToString()
                            }
                        },
                        new[]
                        {
                            new InlineKeyboardButton
                            {
                                Text = "‍Old first",
                                CallbackData = EGettingWordsStrategy.OldFirst.ToString()
                            }
                        },
                        new[]
                        {
                            new InlineKeyboardButton
                            {
                                Text = "‍Random",
                                CallbackData = EGettingWordsStrategy.Random.ToString()
                            }
                        }
                    })
                };

            if (Enum.TryParse(mItem.TextOnly, true, out EGettingWordsStrategy strategy))
                try
                {
                    _repository.SetLearnMode(mItem.ChatId, strategy);
                }
                catch (Exception e)
                {
                    return new AnswerItem
                    {
                        Message = e.Message
                    };
                }
            else
                return new AnswerItem
                {
                    Message = "This mode is not supported"
                };

            return new AnswerItem
            {
                Message = "Mode has been set"
            };
        }
    }
}