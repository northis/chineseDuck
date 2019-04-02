using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class LearnSpeakCommand : LearnCommand
    {
        private readonly IStudyProvider _studyProvider;

        public LearnSpeakCommand(IStudyProvider studyProvider, EditCommand editCommand) : base(studyProvider,
            editCommand)
        {
            _studyProvider = studyProvider;
        }

        public override string GetCommandIconUnicode()
        {
            return "📢";
        }

        public override string GetCommandTextDescription()
        {
            return "Learn how to pronounce these words";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.LearnPronunciation;
        }

        public override LearnUnit ProcessLearn(MessageItem mItem)
        {
            return _studyProvider.LearnWord(mItem.ChatId, ELearnMode.Pronunciation);
        }
    }
}