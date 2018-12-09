using System;

namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IWordFile
    {
        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        string Id { get; set; }

        /// <summary>
        /// Gets or Sets CreateDate
        /// </summary>
        DateTime CreateDate { get; set; }

        /// <summary>
        /// Gets or Sets Height
        /// </summary>
        int Height { get; set; }

        /// <summary>
        /// Gets or Sets Width
        /// </summary>
        int Width { get; set; }
    }
}
