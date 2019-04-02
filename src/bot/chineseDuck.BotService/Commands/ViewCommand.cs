using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class ViewCommand : CommandBase
    {
        private readonly IWordRepository _repository;

        public ViewCommand(IWordRepository repository)
        {
            _repository = repository;
        }

        public override string GetCommandIconUnicode()
        {
            return "👀";
        }

        public override string GetCommandTextDescription()
        {
            return "View a flash card";
        }


        public override ECommands GetCommandType()
        {
            return ECommands.View;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            var answer = new AnswerItem
            {
                Message = "👀"
            };

            if (string.IsNullOrEmpty(mItem.TextOnly))
            {
                answer.Message =
                    "Type a chinese word to view it's flash card. Use chinese characters only! Pinyin and translation are not supported!";
            }
            else
            {
                try
                {
                    var word = _repository.GetWord(mItem.Text, mItem.UserId);

                    if (word == null)
                    {
                        answer.Message = "The word is not found. But you can add it, right?";
                        return answer;
                    }

                    var file = _repository.GetWordFlashCard(word.CardAll.Id);

                    answer.Message = word.ToScoreString();

                    answer.Picture = new GenerateImageResult
                        {Height = word.CardAll.Height, Width = word.CardAll.Width, ImageBody = file};

                    word.Score.ViewCount++;
                    word.Score.LastView = _repository.GetRepositoryTime();
                    _repository.EditWord(word);
                }
                catch (Exception e)
                {
                    answer.Message = e.Message;
                    return answer;
                }
            }

            return answer;
        }
    }
}