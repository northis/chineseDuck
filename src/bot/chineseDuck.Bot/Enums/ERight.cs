using System.Runtime.Serialization;

namespace ChineseDuck.Bot.Enums
{
    public enum RightEnum
    {
        [EnumMember(Value = "read")]
        Read,

        [EnumMember(Value = "write")]
        Write,

        [EnumMember(Value = "admin")]
        Admin
    }
}