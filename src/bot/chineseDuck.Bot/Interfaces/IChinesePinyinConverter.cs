using ChineseDuck.Bot.Enums;

namespace ChineseDuck.Bot.Interfaces
{
    public interface IChinesePinyinConverter
    {
        string[] Convert(char chineseCharacter, EToneType toneType);
        string ToSyllableNumberTone(string syllableMarkTone);
        string[] ToSyllablesAllTones(string syllableMarkTone);
        string[] ToSyllablesNumberAllTones(string syllableNumberTone);
    }
}