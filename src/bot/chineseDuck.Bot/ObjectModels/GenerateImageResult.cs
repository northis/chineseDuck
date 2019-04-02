using System;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.Rest.Model;

namespace ChineseDuck.Bot.ObjectModels
{
    public class GenerateImageResult
    {
        public byte[] ImageBody { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }

        public IWordFile ToWordFile(string fileId)
        {
            return new WordFile {Height = Height, CreateDate = DateTime.Now, Width = Width, Id = fileId};
        }
    }
}