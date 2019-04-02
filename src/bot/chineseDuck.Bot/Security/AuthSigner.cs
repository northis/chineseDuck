using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using ChineseDuck.Bot.Extensions;

namespace chineseDuck.Bot.Security
{
    public class AuthSigner
    {
        private readonly string _encryptKey;

        public AuthSigner(string encryptKey)
        {
            _encryptKey = encryptKey;
        }

        public string Sign(string inputString)
        {
            using (var sha256 = SHA256.Create("sha256"))
            {
                var bSecretKey = sha256.ComputeHash(Encoding.UTF8.GetBytes(_encryptKey));
                using (var h256 = new HMACSHA256(bSecretKey))
                {
                    var hash = h256.ComputeHash(Encoding.UTF8.GetBytes(inputString));
                    return string.Join(string.Empty, hash.Select(p => p.ToString("x2")));
                }
            }
        }

        public string GetAuthUrl(string userId)
        {
            var validTo = DateTime.UtcNow.ToUnixTime();
            var hash = Sign($"auth_date={validTo}\nid={userId}");

            return $"/user/login?auth_date={validTo}&id={userId}&hash={hash}";
        }
    }
}
