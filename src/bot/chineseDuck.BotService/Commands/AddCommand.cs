using System;
using System.Diagnostics;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class AddCommand : ImportCommand
    {
        public AddCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator) : base(parseProvider, repository, flashCardGenerator)
        {
        }

        public override string GetCommandIconUnicode()
        {
            return "➕";
        }

        public override string GetCommandTextDescription()
        {
            return "Add a new chinese word";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Add;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            var addMessage =
                $"Type a chinese word in '<word>{SeparatorChar}<translation>' format or '<word>{SeparatorChar}<pinyin>{SeparatorChar}<translation>'.  Be accurate using pinyin, write a digit after very syllable. For example, use 'shi4' for 4th tone in 'shì' or 'le0' for zero tone in 'le'";

            if (string.IsNullOrEmpty(mItem.TextOnly))
                return new AnswerItem {Message = addMessage};

            try
            {
                var result = SaveAnswerItem(new[] {mItem.TextOnly}, mItem.UserId);

                if (result == null)
                    return new AnswerItem
                    {
                        Message = $"Bad string format.{Environment.NewLine}{addMessage}"
                    };

                return result;
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
                return new AnswerItem {Message = $"Wrong format.{Environment.NewLine}{addMessage}"};
            }
        }
    }
}