using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class LearnTranslationCommand : LearnCommand
    {
        private readonly IStudyProvider _studyProvider;

        public LearnTranslationCommand(IStudyProvider studyProvider, EditCommand editCommand) : base(studyProvider,
            editCommand)
        {
            _studyProvider = studyProvider;
        }

        public override string GetCommandIconUnicode()
        {
            return "🇨🇳";
        }

        public override string GetCommandTextDescription()
        {
            return "Learn what these words mean";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.LearnTranslation;
        }

        public override LearnUnit ProcessLearn(MessageItem mItem)
        {
            return _studyProvider.LearnWord(mItem.ChatId, ELearnMode.Translation);
        }
    }
}