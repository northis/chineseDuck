using System;
using ChineseDuck.Bot.Enums;

namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IUser
    {
        long IdUser { get; set; }
        string Name { get; set; }
        string LastCommand { get; set; }
        DateTime JoinDate { get; set; }
        string Mode { get; set; }
        long CurrentFolderId { get; set; }
        long CurrentWordId { get; set; }
        RightEnum Who { get; set; }
    }
}