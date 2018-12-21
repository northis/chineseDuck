using System;
using ChineseDuck.Bot.ObjectModels;

namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IWord
    {
        long Id { get; set; }
        long OwnerId { get; set; }
        string OriginalWord { get; set; }
        string Pronunciation { get; set; }
        DateTime LastModified { get; set; }
        string Translation { get; set; }
        string Usage { get; set; }
        IWordFile CardAll { get; set; }
        IWordFile CardOriginalWord { get; set; }
        IWordFile CardTranslation { get; set; }
        IWordFile CardPronunciation { get; set; }
        IScore Score { get; set; }

        int SyllablesCount { get; set; }
        long FolderId { get; set; }
    }
}