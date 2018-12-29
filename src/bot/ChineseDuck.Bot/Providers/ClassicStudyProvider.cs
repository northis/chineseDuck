using System;
using System.Linq;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.ObjectModels;

namespace YellowDuck.LearnChinese.Providers
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
            var wordStat = _wordRepository.GetCurrentUserWordStatistic(userId);

            if (wordStat == null)
                throw new Exception($"There no words for this user which must be answered. userId={userId}");

            var learnMode = wordStat.Score.ToELearnMode();

            var result = new AnswerResult {WordStatistic = wordStat};

            switch (learnMode)
            {
                case ELearnMode.OriginalWord:
                    if (wordStat.Score.OriginalWordCount == null)
                        wordStat.Score.OriginalWordCount = 0;
                    if (wordStat.Score.OriginalWordSuccessCount == null)
                        wordStat.Score.OriginalWordSuccessCount = 0;

                    wordStat.Score.OriginalWordCount++;

                    if (string.Join("", wordStat.Word.OriginalWord.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.OriginalWordSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.Pronunciation:
                    if (wordStat.Score.PronunciationCount == null)
                        wordStat.Score.PronunciationCount = 0;
                    if (wordStat.Score.PronunciationSuccessCount == null)
                        wordStat.Score.PronunciationSuccessCount = 0;

                    wordStat.Score.PronunciationCount++;

                    if (string.Join("", wordStat.Word.Pronunciation.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.PronunciationSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.Translation:
                    if (wordStat.Score.TranslationCount == null)
                        wordStat.Score.TranslationCount = 0;
                    if (wordStat.Score.TranslationSuccessCount == null)
                        wordStat.Score.TranslationSuccessCount = 0;

                    wordStat.Score.TranslationCount++;
                    if (string.Join("", wordStat.Word.Translation.Take(MaxAnswerLength)) == possibleAnswer)
                    {
                        wordStat.Score.TranslationSuccessCount++;
                        result.Success = true;
                    }
                    break;

                case ELearnMode.FullView:

                    result.Success = true;
                    break;
            }

            wordStat.Score.IsInLearnMode = false;
            _wordRepository.SetScore(wordStat.Score);

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