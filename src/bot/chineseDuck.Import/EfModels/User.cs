using System;
using System.Collections.Generic;

namespace ChineseDuck.Import.EfModels
{
    public partial class User
    {
        public User()
        {
            Folder = new HashSet<Folder>();
            Score = new HashSet<Score>();
            UserSharingIdFriendNavigation = new HashSet<UserSharing>();
            UserSharingIdOwnerNavigation = new HashSet<UserSharing>();
            Word = new HashSet<Word>();
        }

        public long IdUser { get; set; }
        public string Name { get; set; }
        public string LastCommand { get; set; }
        public DateTime JoinDate { get; set; }
        public string Mode { get; set; }

        public ICollection<Folder> Folder { get; set; }
        public ICollection<Score> Score { get; set; }
        public ICollection<UserSharing> UserSharingIdFriendNavigation { get; set; }
        public ICollection<UserSharing> UserSharingIdOwnerNavigation { get; set; }
        public ICollection<Word> Word { get; set; }
    }
}
