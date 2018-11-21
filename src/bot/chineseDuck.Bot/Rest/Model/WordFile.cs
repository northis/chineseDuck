using System;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class WordFile {
    /// <summary>
    /// Gets or Sets Id
    /// </summary>
    [DataMember(Name="_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "_id")]
    public long? Id { get; set; }

    /// <summary>
    /// Gets or Sets WordId
    /// </summary>
    [DataMember(Name="word_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "word_id")]
    public long? WordId { get; set; }

    /// <summary>
    /// Gets or Sets CreateDate
    /// </summary>
    [DataMember(Name="createDate", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "createDate")]
    public DateTime? CreateDate { get; set; }

    /// <summary>
    /// Gets or Sets Height
    /// </summary>
    [DataMember(Name="height", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "height")]
    public int? Height { get; set; }

    /// <summary>
    /// Gets or Sets Width
    /// </summary>
    [DataMember(Name="width", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "width")]
    public int? Width { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class WordFile {\n");
      sb.Append("  Id: ").Append(Id).Append("\n");
      sb.Append("  WordId: ").Append(WordId).Append("\n");
      sb.Append("  CreateDate: ").Append(CreateDate).Append("\n");
      sb.Append("  Height: ").Append(Height).Append("\n");
      sb.Append("  Width: ").Append(Width).Append("\n");
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
