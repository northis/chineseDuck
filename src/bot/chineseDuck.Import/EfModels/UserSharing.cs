namespace ChineseDuck.Import.EfModels
{
    public partial class UserSharing
    {
        public long Id { get; set; }
        public long IdOwner { get; set; }
        public long IdFriend { get; set; }

        public User IdFriendNavigation { get; set; }
        public User IdOwnerNavigation { get; set; }
    }
}
