using System;

namespace ChineseDuck.Import.EfModels
{
    public partial class WordFileO
    {
        public long IdWord { get; set; }
        public Guid Id { get; set; }
        public DateTime CreateDate { get; set; }
        public byte[] Bytes { get; set; }
        public int? Height { get; set; }
        public int? Width { get; set; }

        public Word IdWordNavigation { get; set; }
    }
}
