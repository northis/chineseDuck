using System;
using System.Linq;

namespace ChineseDuck.Common
{
    public static class CommandLineHelper
    {
        public static string GetParameter(string key)
        {
            return Environment.GetCommandLineArgs().Where(a => a.StartsWith(key))
                .Select(a => a.Replace(key, string.Empty))
                .FirstOrDefault();
        }
    }
}
