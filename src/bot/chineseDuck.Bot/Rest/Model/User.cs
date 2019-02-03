using System;
using System.Runtime.Serialization;
using ChineseDuck.Bot.Enums;
using ChineseDuck.Bot.Interfaces.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ChineseDuck.Bot.Rest.Model
{

    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class User : BaseModel, IUser
    {
        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        [DataMember(Name = "_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "_id")]
        public long IdUser { get; set; }

        /// <summary>
        /// Gets or Sets CurrentFolderId
        /// </summary>
        [DataMember(Name = "currentFolder_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "currentFolder_id")]
        public long CurrentFolderId { get; set; }

        /// <summary>
        /// Gets or Sets CurrentWordId
        /// </summary>
        [DataMember(Name = "currentWord_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "currentWord_id")]
        public long CurrentWordId { get; set; }

        /// <summary>
        /// Gets or Sets Username
        /// </summary>
        [DataMember(Name = "username", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "username")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or Sets TokenHash
        /// </summary>
        [DataMember(Name = "tokenHash", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "tokenHash")]
        public string TokenHash { get; set; }

        /// <summary>
        /// Gets or Sets LastCommand
        /// </summary>
        [DataMember(Name = "lastCommand", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "lastCommand")]
        public string LastCommand { get; set; }

        /// <summary>
        /// Gets or Sets JoinDate
        /// </summary>
        [DataMember(Name = "joinDate", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "joinDate")]
        public DateTime JoinDate { get; set; }

        /// <summary>
        /// Gets or Sets Who
        /// </summary>
        [DataMember(Name = "who", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "who")]
        [JsonConverter(typeof(StringEnumConverter))]
        public RightEnum Who { get; set; }

        /// <summary>
        /// Gets or Sets Mode
        /// </summary>
        [DataMember(Name = "mode", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "mode")]
        public string Mode { get; set; }

    }
}
