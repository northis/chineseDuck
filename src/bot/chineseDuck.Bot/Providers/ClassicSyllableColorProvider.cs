using System;
using System.Drawing;
using System.Text.RegularExpressions;
using ChineseDuck.Bot.Interfaces;

namespace YellowDuck.LearnChinese.Providers
{
    public class ClassicSyllableColorProvider : ISyllableColorProvider
    {
        #region Methods

        private short GetSyllableNumber(string latinSyllableNumber)
        {
            var numberOnly = Regex.Match(latinSyllableNumber, "[0-9]");

            if (!numberOnly.Success || !short.TryParse(numberOnly.Value, out var syllableNumber))
                throw new Exception("The tone is wrong, try again");

            return syllableNumber;
        }

        public Color GetSyllableColor(char chineseChar, string pinyinWithNumber)
        {
            var syllableNumber = GetSyllableNumber(pinyinWithNumber);

            switch (syllableNumber)
            {
                case 1:
                    return Color.Red;
                case 2:
                    return Color.Orange;
                case 3:
                    return Color.Green;
                case 4:
                    return Color.Blue;
                default:
                    return Color.Black;
            }
        }

        #endregion
    }
}