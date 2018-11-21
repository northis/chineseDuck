using System;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class Folder {
    /// <summary>
    /// Gets or Sets Id
    /// </summary>
    [DataMember(Name="_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "_id")]
    public long? Id { get; set; }

    /// <summary>
    /// Gets or Sets OwnerId
    /// </summary>
    [DataMember(Name="owner_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "owner_id")]
    public long? OwnerId { get; set; }

    /// <summary>
    /// Gets or Sets Name
    /// </summary>
    [DataMember(Name="name", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }

    /// <summary>
    /// Gets or Sets Owner
    /// </summary>
    [DataMember(Name="owner", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "owner")]
    public User Owner { get; set; }

    /// <summary>
    /// Gets or Sets ActivityDate
    /// </summary>
    [DataMember(Name="activityDate", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "activityDate")]
    public DateTime? ActivityDate { get; set; }

    /// <summary>
    /// Gets or Sets WordsCount
    /// </summary>
    [DataMember(Name="wordsCount", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "wordsCount")]
    public int? WordsCount { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class Folder {\n");
      sb.Append("  Id: ").Append(Id).Append("\n");
      sb.Append("  OwnerId: ").Append(OwnerId).Append("\n");
      sb.Append("  Name: ").Append(Name).Append("\n");
      sb.Append("  Owner: ").Append(Owner).Append("\n");
      sb.Append("  ActivityDate: ").Append(ActivityDate).Append("\n");
      sb.Append("  WordsCount: ").Append(WordsCount).Append("\n");
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
