using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IChineseWordParseProvider
    {
        Syllable BuildSyllable(char chineseChar, string pinyinWithNumber);
        Syllable[] GetOrderedSyllables(string word);
        Syllable[] GetOrderedSyllables(IWord word);

        ImportWordResult ImportWords(string[] rawWords, bool usePinyin);
    }
}