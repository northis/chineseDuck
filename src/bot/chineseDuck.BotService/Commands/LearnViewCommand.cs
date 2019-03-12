using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class LearnViewCommand : NextCommand
    {
        private readonly IStudyProvider _studyProvider;

        public LearnViewCommand(IStudyProvider studyProvider, EditCommand editCommand) : base(editCommand)
        {
            _studyProvider = studyProvider;
        }

        public override string GetCommandIconUnicode()
        {
            return "🎓👀";
        }

        public override string GetCommandTextDescription()
        {
            return "Just view these words";
        }


        public override ECommands GetCommandType()
        {
            return ECommands.LearnView;
        }

        public override AnswerItem ProcessAnswer(AnswerItem previousAnswerItem, MessageItem mItem)
        {
            return new AnswerItem
            {
                Message = "This command doesn't support such options"
            };
        }

        public override LearnUnit ProcessLearn(MessageItem mItem)
        {
            return _studyProvider.LearnWord(mItem.ChatId, ELearnMode.FullView);
        }

        public override AnswerItem ProcessNext(AnswerItem previousAnswerItem, LearnUnit lUnit)
        {
            return new AnswerItem
            {
                Message = lUnit.WordStatistic ?? GetCommandIconUnicode(),
                Picture = lUnit.Picture,
                Markup = GetLearnMarkup(lUnit.IdWord.GetValueOrDefault())
            };
        }
    }
}