using System;
using System.Collections.Generic;
using System.Text;
using ChineseDuck.Bot.Rest.Model;

namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IFolder
    {
        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        long? Id { get; set; }

        /// <summary>
        /// Gets or Sets OwnerId
        /// </summary>
        long? OwnerId { get; set; }

        /// <summary>
        /// Gets or Sets Name
        /// </summary>
        string Name { get; set; }

        /// <summary>
        /// Gets or Sets Owner
        /// </summary>
        User Owner { get; set; }

        /// <summary>
        /// Gets or Sets ActivityDate
        /// </summary>
        DateTime? ActivityDate { get; set; }

        /// <summary>
        /// Gets or Sets WordsCount
        /// </summary>
        int? WordsCount { get; set; }
    }

}
