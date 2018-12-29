using System;
using System.Text.RegularExpressions;
using System.Windows.Media;
using YellowDuck.LearnChinese.Interfaces;

namespace YellowDuck.LearnChinese.Providers
{
    public class ClassicSyllableColorProvider : ISyllableColorProvider
    {
        #region Methods

        private short GetSyllableNumber(string latinSyllableNumber)
        {
            var numberOnly = Regex.Match(latinSyllableNumber, "[0-9]");
            short syllableNumber;

            if (!numberOnly.Success || !short.TryParse(numberOnly.Value, out syllableNumber))
                throw new Exception("The tone is wrong, try again");

            return syllableNumber;
        }

        public Color GetSyllableColor(char chineseChar, string pinyinWithNumber)
        {
            var syllableNumber = GetSyllableNumber(pinyinWithNumber);

            switch (syllableNumber)
            {
                case 1:
                    return Colors.Red;
                case 2:
                    return Colors.Orange;
                case 3:
                    return Colors.Green;
                case 4:
                    return Colors.Blue;
                default:
                    return Colors.Black;
            }
        }

        #endregion
    }
}