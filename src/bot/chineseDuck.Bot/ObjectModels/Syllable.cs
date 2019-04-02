using System.Drawing;

namespace ChineseDuck.Bot.ObjectModels
{
    public class Syllable
    {
        #region Constructors

        public Syllable(char chineseChar, string pinyin, Color color)
        {
            ChineseChar = chineseChar;
            Pinyin = pinyin;
            Color = color;
        }

        public Syllable(char commonChar) : this(commonChar, string.Empty, Color.Black)
        {
        }

        #endregion

        #region Properties

        public char ChineseChar { get; set; }
        public string Pinyin { get; set; }
        public Color Color { get; set; }

        #endregion
    }
}