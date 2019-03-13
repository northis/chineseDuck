using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class DefaultCommand : CommandBase
    {
        private readonly IWordRepository _repository;

        public DefaultCommand(IWordRepository repository)
        {
            _repository = repository;
        }

        public override string GetCommandIconUnicode()
        {
            return "👌";
        }

        public override string GetCommandTextDescription()
        {
            return "Set default mode";
        }


        public override ECommands GetCommandType()
        {
            return ECommands.Default;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            try
            {
                _repository.SetLearnMode(mItem.ChatId, EGettingWordsStrategy.Random);
            }
            catch (Exception e)
            {
                return new AnswerItem
                {
                    Message = e.Message
                };
            }
            return new AnswerItem
            {
                Message = "Defaut mode has been set (hard, old words first)"
            };
        }
    }
}