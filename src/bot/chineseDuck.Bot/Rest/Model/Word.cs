using System;
using System.Runtime.Serialization;
using ChineseDuck.Bot.Extensions;
using ChineseDuck.Bot.Interfaces.Data;
using ChineseDuck.Bot.Rest.Converters;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public class Word : BaseModel, IWord
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
        /// Gets or Sets OriginalWord
        /// </summary>
        [DataMember(Name = "originalWord", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "originalWord")]
        public string OriginalWord { get; set; }

        /// <summary>
        /// Gets or Sets Pronunciation
        /// </summary>
        [DataMember(Name = "pronunciation", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "pronunciation")]
        public string Pronunciation { get; set; }

        /// <summary>
        /// Gets or Sets Translation
        /// </summary>
        [DataMember(Name = "translation", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "translation")]
        public string Translation { get; set; }

        /// <summary>
        /// Gets or Sets Usage
        /// </summary>
        [DataMember(Name = "usage", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "usage")]
        public string Usage { get; set; }

        /// <summary>
        /// Gets or Sets SyllablesCount
        /// </summary>
        [DataMember(Name = "syllablesCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "syllablesCount")]
        public int SyllablesCount { get; set; }

        /// <summary>
        /// Gets or Sets Score
        /// </summary>
        [DataMember(Name = "score", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "score")]
        [JsonConverter(typeof(ConcreteTypeConverter<Score>))]
        public IScore Score { get; set; }

        /// <summary>
        /// Gets or Sets Full
        /// </summary>
        [DataMember(Name = "full", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "full")]
        [JsonConverter(typeof(ConcreteTypeConverter<WordFile>))]
        public IWordFile CardAll { get; set; }

        /// <summary>
        /// Gets or Sets Orig
        /// </summary>
        [DataMember(Name = "orig", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "orig")]
        [JsonConverter(typeof(ConcreteTypeConverter<WordFile>))]
        public IWordFile CardOriginalWord { get; set; }

        /// <summary>
        /// Gets or Sets Pron
        /// </summary>
        [DataMember(Name = "pron", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "pron")]
        [JsonConverter(typeof(ConcreteTypeConverter<WordFile>))]
        public IWordFile CardPronunciation { get; set; }

        /// <summary>
        /// Gets or Sets Trans
        /// </summary>
        [DataMember(Name = "trans", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "trans")]
        [JsonConverter(typeof(ConcreteTypeConverter<WordFile>))]
        public IWordFile CardTranslation { get; set; }

        /// <summary>
        /// Gets or Sets FolderId
        /// </summary>
        [DataMember(Name = "folder_id", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "folder_id")]
        public long FolderId { get; set; }

        /// <summary>
        /// Gets or Sets LastModified
        /// </summary>
        [DataMember(Name = "lastModified", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "lastModified")]
        public DateTime LastModified { get; set; }

        public override string ToString()
        {
            return this.ToScoreString();
        }
    }
}
