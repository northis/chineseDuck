using System;
using System.Diagnostics;

namespace ChineseDuck.Common.Logging
{
    public class Log4NetTraceListener : TraceListener
    {
        #region Methods

        public override void Write(string message)
        {
            Log4NetService.Instance.Write(message, null, null);
        }

        public override void Fail(string message, string detailMessage)
        {
            Log4NetService.Instance.Write(message, new ApplicationException(detailMessage), null);
        }

        public override void WriteLine(string message)
        {
            Write(message);
        }

        #endregion
    }
}