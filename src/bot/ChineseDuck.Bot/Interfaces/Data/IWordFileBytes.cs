namespace ChineseDuck.Bot.Interfaces.Data
{
    public interface IWordFileBytes
    {
        string Id { get; set; }
        byte[] Bytes { get; set; }
    }
}