using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class ApiUser {
    /// <summary>
    /// Gets or Sets Id
    /// </summary>
    [DataMember(Name="id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    /// <summary>
    /// Gets or Sets Code
    /// </summary>
    [DataMember(Name="code", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "code")]
    public string Code { get; set; }

    /// <summary>
    /// Gets or Sets Hash
    /// </summary>
    [DataMember(Name="hash", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "hash")]
    public string Hash { get; set; }

    /// <summary>
    /// Gets or Sets Remember
    /// </summary>
    [DataMember(Name="remember", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "remember")]
    public bool? Remember { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class ApiUser {\n");
      sb.Append("  Id: ").Append(Id).Append("\n");
      sb.Append("  Code: ").Append(Code).Append("\n");
      sb.Append("  Hash: ").Append(Hash).Append("\n");
      sb.Append("  Remember: ").Append(Remember).Append("\n");
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
