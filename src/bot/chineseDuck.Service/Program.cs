using System;
using ChineseDuck.Common.Logging;

namespace ChineseDuck.BotService {
    class Program {
        static void Main (string[] args) {
            Console.WriteLine ("Hello World!");

            Log4NetService.Instance.Write("Hello World!2");
            Console.Read ();
        }
    }
}