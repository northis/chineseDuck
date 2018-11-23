using System;
using System.Runtime.Serialization;
using System.Text;
using ChineseDuck.Bot.Interfaces.Data;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class Word :IWord {
    /// <summary>
    /// Gets or Sets Id
    /// </summary>
    [DataMember(Name="_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "_id")]
    public long WordId { get; set; }

    /// <summary>
    /// Gets or Sets OwnerId
    /// </summary>
    [DataMember(Name="owner_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "owner_id")]
    public long? OwnerId { get; set; }

    /// <summary>
    /// Gets or Sets OriginalWord
    /// </summary>
    [DataMember(Name="originalWord", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "originalWord")]
    public string OriginalWord { get; set; }

    /// <summary>
    /// Gets or Sets Pronunciation
    /// </summary>
    [DataMember(Name="pronunciation", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "pronunciation")]
    public string Pronunciation { get; set; }

    /// <summary>
    /// Gets or Sets Translation
    /// </summary>
    [DataMember(Name="translation", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "translation")]
    public string Translation { get; set; }

    /// <summary>
    /// Gets or Sets Usage
    /// </summary>
    [DataMember(Name="usage", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "usage")]
    public string Usage { get; set; }

    /// <summary>
    /// Gets or Sets SyllablesCount
    /// </summary>
    [DataMember(Name="syllablesCount", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "syllablesCount")]
    public int? SyllablesCount { get; set; }

    /// <summary>
    /// Gets or Sets Score
    /// </summary>
    [DataMember(Name="score", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "score")]
    public Score Score { get; set; }

    /// <summary>
    /// Gets or Sets Full
    /// </summary>
    [DataMember(Name="full", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "full")]
    public WordFile Full { get; set; }

    /// <summary>
    /// Gets or Sets Orig
    /// </summary>
    [DataMember(Name="orig", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "orig")]
    public WordFile Orig { get; set; }

    /// <summary>
    /// Gets or Sets Pron
    /// </summary>
    [DataMember(Name="pron", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "pron")]
    public WordFile Pron { get; set; }

    /// <summary>
    /// Gets or Sets Trans
    /// </summary>
    [DataMember(Name="trans", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "trans")]
    public WordFile Trans { get; set; }

    /// <summary>
    /// Gets or Sets FolderId
    /// </summary>
    [DataMember(Name="folder_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "folder_id")]
    public long? FolderId { get; set; }

    /// <summary>
    /// Gets or Sets LastModified
    /// </summary>
    [DataMember(Name="lastModified", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "lastModified")]
    public DateTime? LastModified { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class Word {\n");
      sb.Append("  Id: ").Append(Id).Append("\n");
      sb.Append("  OwnerId: ").Append(OwnerId).Append("\n");
      sb.Append("  OriginalWord: ").Append(OriginalWord).Append("\n");
      sb.Append("  Pronunciation: ").Append(Pronunciation).Append("\n");
      sb.Append("  Translation: ").Append(Translation).Append("\n");
      sb.Append("  Usage: ").Append(Usage).Append("\n");
      sb.Append("  SyllablesCount: ").Append(SyllablesCount).Append("\n");
      sb.Append("  Score: ").Append(Score).Append("\n");
      sb.Append("  Full: ").Append(Full).Append("\n");
      sb.Append("  Orig: ").Append(Orig).Append("\n");
      sb.Append("  Pron: ").Append(Pron).Append("\n");
      sb.Append("  Trans: ").Append(Trans).Append("\n");
      sb.Append("  FolderId: ").Append(FolderId).Append("\n");
      sb.Append("  LastModified: ").Append(LastModified).Append("\n");
      sb.Append("}\n");
      return sb.ToString();
    }

    /// <summary>
    /// Get the JSON string presentation of the object
    /// </summary>
    /// <returns>JSON string presentation of the object</returns>
    public string ToJson() {
      return JsonConvert.SerializeObject(this, Formatting.Indented);
    }

}
}
