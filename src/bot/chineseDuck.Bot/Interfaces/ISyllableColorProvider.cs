namespace ChineseDuck.Bot.Interfaces
{
    public interface ISyllableColorProvider
    {
        Color GetSyllableColor(char chineseChar, string pinyinWithNumber);
    }
}