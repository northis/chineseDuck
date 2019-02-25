using System;
using System.Collections.Generic;
using ChineseDuck.Bot.Interfaces;

namespace ChineseDuck.Bot.Providers
{
    public class ClassicSyllablesToStringConverter : ISyllablesToStringConverter
    {
        #region Fields

        public const string SyllableSeparator = "|";

        #endregion

        #region Methods

        public IEnumerable<string> Parse(string pinyinString)
        {
            return pinyinString?.Split(new[] {GetSeparator()}, StringSplitOptions.RemoveEmptyEntries);
        }

        public string Join(IEnumerable<string> syllables)
        {
            return string.Join(GetSeparator(), syllables);
        }

        public string GetSeparator()
        {
            return SyllableSeparator;
        }

        #endregion
    }
}