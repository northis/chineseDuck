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
    public class Score : BaseModel, IScore
    {
        /// <summary>
        /// Gets or Sets OriginalWordCount
        /// </summary>
        [DataMember(Name = "originalWordCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "originalWordCount")]
        public int OriginalWordCount { get; set; }

        /// <summary>
        /// Gets or Sets OriginalWordSuccessCount
        /// </summary>
        [DataMember(Name = "originalWordSuccessCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "originalWordSuccessCount")]
        public int OriginalWordSuccessCount { get; set; }

        /// <summary>
        /// Gets or Sets LastView
        /// </summary>
        [DataMember(Name = "lastView", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "lastView")]
        public DateTime LastView { get; set; }

        /// <summary>
        /// Gets or Sets LastLearned
        /// </summary>
        [DataMember(Name = "lastLearned", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "lastLearned")]
        public DateTime? LastLearned { get; set; }

        /// <summary>
        /// Gets or Sets LastLearnMode
        /// </summary>
        [DataMember(Name = "lastLearnMode", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "lastLearnMode")]
        public string LastLearnMode { get; set; }

        /// <summary>
        /// Gets or Sets IsInLearnMode
        /// </summary>
        [DataMember(Name = "isInLearnMode", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "isInLearnMode")]
        public bool IsInLearnMode { get; set; }

        /// <summary>
        /// Gets or Sets RightAnswerNumber
        /// </summary>
        [DataMember(Name = "rightAnswerNumber", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "rightAnswerNumber")]
        public short? RightAnswerNumber { get; set; }

        /// <summary>
        /// Gets or Sets PronunciationCount
        /// </summary>
        [DataMember(Name = "pronunciationCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "pronunciationCount")]
        public int PronunciationCount { get; set; }

        /// <summary>
        /// Gets or Sets PronunciationSuccessCount
        /// </summary>
        [DataMember(Name = "pronunciationSuccessCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "pronunciationSuccessCount")]
        public int PronunciationSuccessCount { get; set; }

        /// <summary>
        /// Gets or Sets TranslationCount
        /// </summary>
        [DataMember(Name = "translationCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "translationCount")]
        public int TranslationCount { get; set; }

        /// <summary>
        /// Gets or Sets TranslationSuccessCount
        /// </summary>
        [DataMember(Name = "translationSuccessCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "translationSuccessCount")]
        public int TranslationSuccessCount { get; set; }

        /// <summary>
        /// Gets or Sets ViewCount
        /// </summary>
        [DataMember(Name = "viewCount", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "viewCount")]
        public int ViewCount { get; set; }

        /// <summary>
        /// Gets or Sets Name
        /// </summary>
        [DataMember(Name = "name", EmitDefaultValue = false)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

    }
}
