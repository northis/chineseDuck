using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Providers
{
    public class ClassicStudyProvider : IStudyProvider
    {
        #region Constructors

        public ClassicStudyProvider(IWordRepository wordRepository)
        {
            _wordRepository = wordRepository;
        }

        #endregion

        public AnswerResult AnswerWord(long userId, string possibleAnswer)
        {
            var wordStat = _wordRepository.GetCurrentWord(userId);

            if (wordStat == null)
                throw new Exception($"There no words for this user which must be answered. userId={userId}");

            var learnMode = wordStat.Score.ToELearnMode(userId);
            var file = _wordRepository.GetWordFlashCard(wordStat.CardAll.Id);

            var result = new AnswerResult {WordStatistic = wordStat, Picture = file };

            switch (learnMode)
            {
                case ELearnMode.OriginalWord:

                    wordStat.Score.OriginalWordCount++;

                    if (string.Join("", wordStat.OriginalWord.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.OriginalWordSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.Pronunciation:

                    wordStat.Score.PronunciationCount++;

                    if (string.Join("", wordStat.Pronunciation.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.PronunciationSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.Translation:

                    wordStat.Score.TranslationCount++;
                    if (string.Join("", wordStat.Translation.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.TranslationSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.FullView:

                    result.Success = true;
                    break;
            }

            _wordRepository.SetScore(wordStat.Id, wordStat.Score);
            return result;
        }

        public LearnUnit LearnWord(long userId, ELearnMode learnMode)
        {
            return
                _wordRepository.GetNextWord(new WordSettings
                {
                    LearnMode = learnMode,
                    UserId = userId,
                    PollAnswersCount = PollAnswersCount
                });
        }

        #region Fields

        private readonly IWordRepository _wordRepository;

        public const ushort PollAnswersCount = 4;
        public const int MaxAnswerLength = 30;

        #endregion
    }
}