using System.Collections.Generic;
using System.Linq;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands.Common
{
    public abstract class LearnCommand : NextCommand
    {
        public const int MaxAnswerLength = 30;

        private readonly IStudyProvider _studyProvider;

        protected LearnCommand(IStudyProvider studyProvider, EditCommand editCommand) : base(editCommand)
        {
            _studyProvider = studyProvider;
        }

        public override AnswerItem ProcessAnswer(AnswerItem previousAnswerItem, MessageItem mItem)
        {
            var checkResult = _studyProvider.AnswerWord(mItem.ChatId, mItem.TextOnly);
            previousAnswerItem.Picture = checkResult.WordStatistic.CardAll.ToGenerateImageResult(checkResult.Picture);
            previousAnswerItem.Message = (checkResult.Success ? "✅ " : "⛔️ ") + checkResult.WordStatistic;
            previousAnswerItem.Markup = GetLearnMarkup(checkResult.WordStatistic.Id);

            return previousAnswerItem;
        }

        public override AnswerItem ProcessNext(AnswerItem previousAnswerItem, LearnUnit lUnit)
        {
            var buttons = new List<InlineKeyboardButton[]>();
            foreach (var option in lUnit.Options)
            {
                var answer = string.Join("", option.Take(MaxAnswerLength));
                buttons.Add(new []
                {
                    new InlineKeyboardButton{ Text = answer, CallbackData = answer}
                });
            }

            previousAnswerItem.Markup = new InlineKeyboardMarkup(buttons);
            previousAnswerItem.Picture = lUnit.Picture;
            return previousAnswerItem;
        }
    }
}