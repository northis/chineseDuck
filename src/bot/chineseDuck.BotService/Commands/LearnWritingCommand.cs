using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class LearnWritingCommand : LearnCommand
    {
        private readonly IStudyProvider _studyProvider;

        public LearnWritingCommand(IStudyProvider studyProvider, EditCommand editCommand) : base(studyProvider,
            editCommand)
        {
            _studyProvider = studyProvider;
        }

        public override string GetCommandIconUnicode()
        {
            return "🖌";
        }

        public override string GetCommandTextDescription()
        {
            return "Learn how to write these words";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.LearnWriting;
        }

        public override LearnUnit ProcessLearn(MessageItem mItem)
        {
            return _studyProvider.LearnWord(mItem.ChatId, ELearnMode.OriginalWord);
        }
    }
}