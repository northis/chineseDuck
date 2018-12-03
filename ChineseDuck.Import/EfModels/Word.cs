using System;
using System.Collections.Generic;

namespace ChineseDuck.Import.EfModels
{
    public partial class Word
    {
        public Word()
        {
            FolderWord = new HashSet<FolderWord>();
        }

        public long Id { get; set; }
        public string OriginalWord { get; set; }
        public string Pronunciation { get; set; }
        public DateTime LastModified { get; set; }
        public string Translation { get; set; }
        public string Usage { get; set; }
        public long IdOwner { get; set; }
        public int SyllablesCount { get; set; }

        public User IdOwnerNavigation { get; set; }
        public WordFileA WordFileA { get; set; }
        public WordFileO WordFileO { get; set; }
        public WordFileP WordFileP { get; set; }
        public WordFileT WordFileT { get; set; }
        public ICollection<FolderWord> FolderWord { get; set; }
    }
}
