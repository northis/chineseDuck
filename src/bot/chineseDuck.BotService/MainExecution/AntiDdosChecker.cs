using System;
using System.Collections.Generic;

namespace ChineseDuck.BotService.MainExecution
{
    public class AntiDdosChecker
    {
        private static readonly Dictionary<long, DateTime> UserAccessTable = new Dictionary<long, DateTime>();
        private static readonly Dictionary<long, DateTime> UserBackList = new Dictionary<long, DateTime>();
        private readonly Func<DateTime> _getTime;
        public TimeSpan BanInterval = TimeSpan.FromMinutes(1);

        public TimeSpan FrequencyThreshold = TimeSpan.FromMilliseconds(100);

        public AntiDdosChecker(Func<DateTime> getTime)
        {
            _getTime = getTime;
        }

        public bool AllowUser(long idUser)
        {
            var checkTime = _getTime();

            if (!UserAccessTable.ContainsKey(idUser))
            {
                UserAccessTable[idUser] = checkTime;
                return true;
            }

            if (UserBackList.ContainsKey(idUser))
            {
                if (checkTime - UserBackList[idUser] > BanInterval)
                {
                    UserBackList.Remove(idUser);
                    return true;
                }

                UserAccessTable[idUser] = checkTime;
                return false;
            }

            var allowUser = checkTime - UserAccessTable[idUser] > FrequencyThreshold;
            UserAccessTable[idUser] = checkTime;

            if (!allowUser)
                UserBackList[idUser] = checkTime;

            return allowUser;
        }

        public void ResetAccessTables()
        {
            UserAccessTable.Clear();
        }

        public void UserQueryProcessed(long idUser)
        {
            UserAccessTable[idUser] = _getTime();
        }
    }
}