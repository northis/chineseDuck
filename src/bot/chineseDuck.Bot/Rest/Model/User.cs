using System;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class User {
    /// <summary>
    /// Gets or Sets Id
    /// </summary>
    [DataMember(Name="_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "_id")]
    public long? Id { get; set; }

    /// <summary>
    /// Gets or Sets CurrentFolderId
    /// </summary>
    [DataMember(Name="currentFolder_id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "currentFolder_id")]
    public long? CurrentFolderId { get; set; }

    /// <summary>
    /// Gets or Sets Username
    /// </summary>
    [DataMember(Name="username", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "username")]
    public string Username { get; set; }

    /// <summary>
    /// Gets or Sets TokenHash
    /// </summary>
    [DataMember(Name="tokenHash", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "tokenHash")]
    public string TokenHash { get; set; }

    /// <summary>
    /// Gets or Sets LastCommand
    /// </summary>
    [DataMember(Name="lastCommand", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "lastCommand")]
    public string LastCommand { get; set; }

    /// <summary>
    /// Gets or Sets JoinDate
    /// </summary>
    [DataMember(Name="joinDate", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "joinDate")]
    public DateTime? JoinDate { get; set; }

    /// <summary>
    /// Gets or Sets Who
    /// </summary>
    [DataMember(Name="who", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "who")]
    public string Who { get; set; }

    /// <summary>
    /// Gets or Sets Mode
    /// </summary>
    [DataMember(Name="mode", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "mode")]
    public string Mode { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class User {\n");
      sb.Append("  Id: ").Append(Id).Append("\n");
      sb.Append("  CurrentFolderId: ").Append(CurrentFolderId).Append("\n");
      sb.Append("  Username: ").Append(Username).Append("\n");
      sb.Append("  TokenHash: ").Append(TokenHash).Append("\n");
      sb.Append("  LastCommand: ").Append(LastCommand).Append("\n");
      sb.Append("  JoinDate: ").Append(JoinDate).Append("\n");
      sb.Append("  Who: ").Append(Who).Append("\n");
      sb.Append("  Mode: ").Append(Mode).Append("\n");
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
