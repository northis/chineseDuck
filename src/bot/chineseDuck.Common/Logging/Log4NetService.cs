using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Xml;
using log4net;
using log4net.Config;
using log4net.Core;
using log4net.Repository.Hierarchy;
using log4net.Util;

namespace ChineseDuck.Common.Logging
{
    public class Log4NetService : ILogService
    {
        #region Constructors

        static Log4NetService()
        {
            var log4NetConfig = new XmlDocument();

            var currentAssembly = Assembly.GetEntryAssembly();
            var currentFolder = Directory.GetParent(currentAssembly.Location).FullName;
            var cfg = Path.Combine(currentFolder, "log4net.config");
            
            log4NetConfig.Load(File.OpenRead(cfg));

            var repo = LogManager.CreateRepository(currentAssembly, typeof(Hierarchy));
            XmlConfigurator.Configure(repo, log4NetConfig["log4net"]);

            var hierarchy = (Hierarchy)repo;
            MainLogger = hierarchy.Root;
        }

        #endregion

        #region Methods

        public void Write(string message, Exception ex = null, Dictionary<string, object> parameters = null)
        {
            var props = new LoggingEventData
            {
                TimeStampUtc = DateTime.UtcNow,
                Message = message
            };

            if (ex != null)
            {
                props.Level = Level.Error;
                props.Message = ex.ToString();
            }
            else
            {
                props.Level = Level.Info;
            }

            if (parameters != null)
            {
                props.Properties = new PropertiesDictionary();
                foreach (var pr in parameters)
                    props.Properties[pr.Key] = pr.Value;
            }

            MainLogger.Log(new LoggingEvent(props));
        }

        #endregion

        #region Fields

        public static Log4NetService Instance = new Log4NetService();
        private static readonly Logger MainLogger;

        #endregion
    }
}