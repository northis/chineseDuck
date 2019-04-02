using System;
using System.Text;
using Newtonsoft.Json;

namespace ChineseDuck.Bot.Rest.Model
{
    public abstract class BaseModel
    {
        /// <summary>
        /// Get the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
        
        /// <summary>
        /// Get the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            var thisType = GetType();
            var cr = Environment.NewLine;

            sb.Append($"class {thisType.Name} {cr}");

            foreach (var prop in thisType.GetProperties())
            {
                sb.Append($" {prop.Name}: {prop.GetValue(this)}{cr}");
            }

            sb.Append($"}}{cr}");
            return sb.ToString();
        }
    }
}
