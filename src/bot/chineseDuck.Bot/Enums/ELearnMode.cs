using System.Runtime.Serialization;

namespace ChineseDuck.Bot.Enums
{
    public enum ELearnMode
    {
        [EnumMember(Value = nameof(OriginalWord))]
        OriginalWord = 1,

        [EnumMember(Value = nameof(Translation))]
        Translation = 2,

        [EnumMember(Value = nameof(Pronunciation))]
        Pronunciation = 3,

        [EnumMember(Value = nameof(FullView))]
        FullView = 4
    }
}