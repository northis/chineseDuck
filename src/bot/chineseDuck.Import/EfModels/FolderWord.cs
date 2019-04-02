namespace ChineseDuck.Import.EfModels
{
    public partial class FolderWord
    {
        public long Id { get; set; }
        public long IdWord { get; set; }
        public long IdFolder { get; set; }

        public Folder IdFolderNavigation { get; set; }
        public Word IdWordNavigation { get; set; }
    }
}
