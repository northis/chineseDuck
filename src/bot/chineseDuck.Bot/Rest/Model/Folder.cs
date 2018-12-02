using System;
using System.Runtime.Serialization;
using ChineseDuck.Bot.Interfaces.Data;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model
{
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class Folder : BaseModel, IFolder
    {
        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        [DataMember(Name = "_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "_id")]
        public long Id { get; set; }

        /// <summary>
        /// Gets or Sets OwnerId
        /// </summary>
        [DataMember(Name = "owner_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "owner_id")]
        public long OwnerId { get; set; }

        /// <summary>
        /// Gets or Sets Name
        /// </summary>
        [DataMember(Name = "name", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or Sets Owner
        /// </summary>
        [DataMember(Name = "owner", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "owner")]
        public IUser Owner { get; set; }

        /// <summary>
        /// Gets or Sets ActivityDate
        /// </summary>
        [DataMember(Name = "activityDate", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "activityDate")]
        public DateTime ActivityDate { get; set; }

        /// <summary>
        /// Gets or Sets WordsCount
        /// </summary>
        [DataMember(Name = "wordsCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "wordsCount")]
        public int WordsCount { get; set; }
    }
}
