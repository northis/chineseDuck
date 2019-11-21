using System.IO;

namespace ChineseDuck.Bot.Rest.Client
{
    /// <summary>
    /// Represents a set of configuration settings
    /// </summary>
    public class Configuration
    {
        private static string _tempFolderPath = Path.GetTempPath();
  
        /// <summary>
        /// Gets or sets the temporary folder path to store the files downloaded from the server.
        /// </summary>
        /// <value>Folder path.</value>
        public static string TempFolderPath
        {
            get => _tempFolderPath;

            set 
            {
                if (string.IsNullOrEmpty(value))
                {
                    _tempFolderPath = value;
                    return;
                }
      
                // create the directory if it does not exist
                if (!Directory.Exists(value)) 
                    Directory.CreateDirectory(value);
      
                // check if the path contains directory separator at the end
                if (value[value.Length - 1] == Path.DirectorySeparatorChar)
                    _tempFolderPath = value;
                else
                    _tempFolderPath = value  + Path.DirectorySeparatorChar;
            }
        }

        private const string Iso8601DatetimeFormat = "o";

        private static string _dateTimeFormat = Iso8601DatetimeFormat;
    }
}
