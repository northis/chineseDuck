using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class ImportCommand : CommandBase
    {
        public const uint MaxImportRowLength = 200;
        public const char SeparatorChar = ';';
        public const char SeparatorChar1 = '；';
        public const uint DefaultModeColumnsCount = 2;
        private readonly IFlashCardGenerator _flashCardGenerator;
        private readonly uint _maxImportFileSize;
        private readonly IChineseWordParseProvider _parseProvider;
        private readonly IWordRepository _repository;

        public ImportCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator, uint maxImportFileSize)
        {
            _parseProvider = parseProvider;
            _repository = repository;
            _flashCardGenerator = flashCardGenerator;
            _maxImportFileSize = maxImportFileSize;
        }

        public bool ValidateArray(string[] wordStrings)
        {
            var firstWord = wordStrings.FirstOrDefault();
            if (firstWord == null)
                return false;

            var columnsCount = firstWord.Split(SeparatorChar, SeparatorChar1).Length;
            return columnsCount >= DefaultModeColumnsCount;
        }

        public override string GetCommandIconUnicode()
        {
            return "🚛";
        }

        public override string GetCommandTextDescription()
        {
            return "Import words from a file";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Import;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            var loadFileMessage =
                $"Please give me a .csv file. Rows format is 'word{SeparatorChar}translation{SeparatorChar}usage'. Usage is an optional part.{Environment.NewLine}Examples:{Environment.NewLine}什么{SeparatorChar1}What?{SeparatorChar1}这是什么？{Environment.NewLine}电脑{SeparatorChar1}computer{Environment.NewLine}The word processing may take some time, please wait until the import will be completed. File couldn't be larger than {_maxImportFileSize} bytes";
            
            if (mItem.Stream == null)
            {
                return new AnswerItem
                {
                    Message = loadFileMessage
                };
            }

            if (mItem.FileSize > _maxImportFileSize)
            {
                return new AnswerItem
                {
                    Message =
                        $"File couldn't be larger than {_maxImportFileSize} bytes.{Environment.NewLine}{loadFileMessage}"
                };
            }

            var lines = BytesToLines(mItem.Stream.ToArray());
            var result = SaveAnswerItem(lines, mItem.UserId);

            if (result == null)
            {
                return new AnswerItem
                {
                    Message = $"Bad file.{Environment.NewLine}{loadFileMessage}"
                };
            }

            return result;
        }

        protected string[] BytesToLines(byte[] input)
        {
            var str = Encoding.UTF8.GetString(input);
            return str.Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
        }

        internal void UploadFiles(IWord word)
        {
            Console.WriteLine("Generate flashcard for " + word.OriginalWord);
            var imageResult = _flashCardGenerator.Generate(word, ELearnMode.FullView);
            var fileId = _repository.AddFile(imageResult.ImageBody);
            word.CardAll = imageResult.ToWordFile(fileId);

            imageResult = _flashCardGenerator.Generate(word, ELearnMode.OriginalWord);
            fileId = _repository.AddFile(imageResult.ImageBody);
            word.CardOriginalWord = imageResult.ToWordFile(fileId);

            imageResult = _flashCardGenerator.Generate(word, ELearnMode.Pronunciation);
            fileId = _repository.AddFile(imageResult.ImageBody);
            word.CardPronunciation = imageResult.ToWordFile(fileId);

            imageResult = _flashCardGenerator.Generate(word, ELearnMode.Translation);
            fileId = _repository.AddFile(imageResult.ImageBody);
            word.CardTranslation = imageResult.ToWordFile(fileId);
        }

        protected ImportWordResult UploadWords(ImportWordResult importedResult, long userId)
        {
            var badWords = new List<string>();
            var goodWords = new List<Word>();

            foreach (var word in importedResult.SuccessfulWords)
            {
                try
                {
                    UploadFiles(word);

                    _repository.AddWord(word, userId);
                    goodWords.Add(word);
                }
                catch (Exception ex)
                {
                    Trace.WriteLine(ex);
                    badWords.Add(ex.Message);
                }
            }

            badWords.AddRange(importedResult.FailedWords);
            return new ImportWordResult(goodWords.ToArray(), badWords.ToArray());
        }

        protected AnswerItem SaveAnswerItem(string[] wordStrings, long userId)
        {
            var answer = new AnswerItem
            {
                Message = GetCommandIconUnicode()
            };

            if (!ValidateArray(wordStrings))
                return answer;

            var maxStringLength = wordStrings.Select(a => a.Length).Max();

            if (maxStringLength > MaxImportRowLength)
            {
                answer.Message += $"String length must be less than {MaxImportRowLength}";
                return answer;
            }

            var result = _parseProvider.ImportWords(wordStrings);

            if (result == null)
                return answer;

            var uploadedResult = UploadWords(result, userId);

            if (uploadedResult.SuccessfulWords.Any())
            {
                answer.Message +=
                    $"These words have been added ({uploadedResult.SuccessfulWords.Length}): {Environment.NewLine} {string.Join(Environment.NewLine, uploadedResult.SuccessfulWords.Select(a => a.OriginalWord))}{Environment.NewLine}";
            }

            if (uploadedResult.FailedWords.Any())
            {
                answer.Message +=
                    $"These words have some parse troubles ({uploadedResult.FailedWords.Length}): {Environment.NewLine} {string.Join(Environment.NewLine, uploadedResult.FailedWords)}";
            }

            return answer;
        }
    }
}