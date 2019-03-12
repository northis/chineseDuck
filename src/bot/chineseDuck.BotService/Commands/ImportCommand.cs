using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.BotService.MainExecution;

namespace chineseDuck.BotService.Commands
{
    public class ImportCommand : CommandBase
    {
        public const uint MaxImportFileSize = 10240;
        public const uint MaxImportRows = 70;
        public const uint MaxImportRowLength = 200;
        public const char SeparatorChar = ';';
        public const char SeparatorChar1 = '；';
        public const uint UsePinyinModeColumnsCount = 3;
        public const uint DefaultModeColumnsCount = 2;
        private readonly IFlashCardGenerator _flashCardGenerator;
        private readonly IChineseWordParseProvider _parseProvider;
        private readonly IWordRepository _repository;

        public ImportCommand(IChineseWordParseProvider parseProvider, IWordRepository repository,
            IFlashCardGenerator flashCardGenerator)
        {
            _parseProvider = parseProvider;
            _repository = repository;
            _flashCardGenerator = flashCardGenerator;
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

        public bool? GetUsePinyin(string[] wordStrings)
        {
            var firstWord = wordStrings.FirstOrDefault();

            if (firstWord == null)
                return null;

            var columnsCount = firstWord.Split(SeparatorChar, SeparatorChar1).Length;

            if (columnsCount != UsePinyinModeColumnsCount && columnsCount != DefaultModeColumnsCount)
                return null;

            return columnsCount == UsePinyinModeColumnsCount;
        }

        public override AnswerItem Reply(MessageItem mItem)
        {
            var loadFileMessage =
                $"Please give me a .csv file. Rows format are 'word{SeparatorChar}translation' or 'word{SeparatorChar}pinyin{SeparatorChar}translation'. Be accurate using pinyin, write a digit after every syllable. For example, use 'shi4' for 4th tone in 'shì' or 'le' for zero  tone in 'le'{Environment.NewLine}The word processing may take some time, please wait until the import will be combleted. File couldn't be larger than {MaxImportFileSize} bytes or contain more than {MaxImportRows} rows";

            var fileStream = mItem.FileStream;

            if (fileStream == null)
                return new AnswerItem
                {
                    Message = loadFileMessage
                };
            if (fileStream.Length > MaxImportFileSize)
                return new AnswerItem
                {
                    Message =
                        $"File couldn't be larger than {MaxImportFileSize} bytes.{Environment.NewLine}{loadFileMessage}"
                };

            var fileStrings = ReadLines(fileStream, Encoding.UTF8).ToArray();
            if (fileStrings.Length > MaxImportRows)
                return new AnswerItem
                {
                    Message =
                        $"Too many words in the file. Maximum is {MaxImportRows}.{Environment.NewLine}{loadFileMessage}"
                };

            var result = SaveAnswerItem(fileStrings, mItem.UserId);

            if (result == null)
                return new AnswerItem
                {
                    Message = $"Bad file.{Environment.NewLine}{loadFileMessage}"
                };

            return result;
        }

        internal void UploadFiles(IWord word)
        {
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

        protected AnswerItem SaveAnswerItem(string[] wordStrings, long userId)
        {
            var usePinyin = GetUsePinyin(wordStrings);

            var answer = new AnswerItem
            {
                Message = GetCommandIconUnicode()
            };

            if (usePinyin == null)
                return answer;

            var maxStringLength = wordStrings.Select(a => a.Length).Max();

            if (maxStringLength > MaxImportRowLength)
            {
                answer.Message += $"String length must be less than {MaxImportRowLength}";
                return answer;
            }

            var result = _parseProvider.ImportWords(wordStrings, usePinyin.Value);

            if (result == null)
                return answer;

            var badWords = new List<string>();
            var goodWords = new List<IWord>();
            foreach (var word in result.SuccessfulWords)
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

            badWords.AddRange(result.FailedWords);

            if (goodWords.Any())
                answer.Message +=
                    $"These words have been added ({goodWords.Count}): {Environment.NewLine} {string.Join(Environment.NewLine, goodWords.Select(a => a.OriginalWord))}{Environment.NewLine}";

            if (badWords.Any())
                answer.Message +=
                    $"These words have some parse troubles ({badWords.Count}): {Environment.NewLine} {string.Join(Environment.NewLine, badWords)}";

            return answer;
        }

        private IEnumerable<string> ReadLines(Stream streamProvider, Encoding encoding)
        {
            using (var stream = streamProvider)
            using (var reader = new StreamReader(stream, encoding))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                    yield return line;
            }
        }
    }
}