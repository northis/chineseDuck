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
    public class WordFile : BaseModel, IWordFile
    {
        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        [DataMember(Name = "id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or Sets CreateDate
        /// </summary>
        [DataMember(Name = "createDate", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "createDate")]
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// Gets or Sets Height
        /// </summary>
        [DataMember(Name = "height", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "height")]
        public int Height { get; set; }

        /// <summary>
        /// Gets or Sets Width
        /// </summary>
        [DataMember(Name = "width", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "width")]
        public int Width { get; set; }
    }
}
