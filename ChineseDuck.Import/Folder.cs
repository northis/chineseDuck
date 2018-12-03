using System;
using System.Collections.Generic;

namespace ChineseDuck.Import
{
    public partial class Folder
    {
        public Folder()
        {
            FolderWord = new HashSet<FolderWord>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long IdUser { get; set; }

        public User IdUserNavigation { get; set; }
        public ICollection<FolderWord> FolderWord { get; set; }
    }
}
