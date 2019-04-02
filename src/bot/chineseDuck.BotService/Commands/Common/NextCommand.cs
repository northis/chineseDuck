using System;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;
using Telegram.Bot.Types.ReplyMarkups;

namespace chineseDuck.BotService.Commands.Common
{
    public abstract class NextCommand : CommandBase
    {
        public const string NextCmd = "next";

        protected NextCommand(EditCommand editCommand)
        {
            EditCommand = editCommand;
        }

        protected EditCommand EditCommand { get; }

        public abstract override string GetCommandIconUnicode();

        public abstract override string GetCommandTextDescription();

        public IReplyMarkup GetLearnMarkup(long idCurrentWord)
        {
            var mkp = new InlineKeyboardMarkup(new[]
            {
                new InlineKeyboardButton{ Text = "🖌Edit", CallbackData = $"{EditCommand.EditCmd}{EditCommand.EditCmdSeparator}{idCurrentWord}"},
                new InlineKeyboardButton{ Text = "➡️Next", CallbackData = NextCmd}
            });

            return mkp;
        }

        public abstract AnswerItem ProcessAnswer(AnswerItem previousAnswerItem, MessageItem mItem);

        public abstract LearnUnit ProcessLearn(MessageItem mItem);
        public abstract AnswerItem ProcessNext(AnswerItem previousAnswerItem, LearnUnit lUnit);

        public override AnswerItem Reply(MessageItem mItem)
        {
            var answerItem = new AnswerItem
            {
                Message = GetCommandIconUnicode()
            };

            try
            {
                if (string.IsNullOrWhiteSpace(mItem.TextOnly) || NextCmd == mItem.TextOnly)
                {
                    var learnUnit = ProcessLearn(mItem);
                    answerItem = ProcessNext(answerItem, learnUnit);
                }

                else if (mItem.TextOnly.StartsWith(EditCommand.EditCmd) ||
                         mItem.TextOnly.Contains(ImportCommand.SeparatorChar.ToString()))
                {
                    answerItem = EditCommand.Reply(mItem);
                }
                else
                {
                    answerItem = ProcessAnswer(answerItem, mItem);
                }
            }
            catch (Exception ex)
            {
                answerItem.Message += Environment.NewLine + ex.Message;
            }

            return answerItem;
        }
    }
}