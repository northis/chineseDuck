using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace ChineseDuck.Import
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();

            Console.WriteLine(configuration.GetConnectionString("OldSqlDb"));

            Console.WriteLine("Hello World!");
            Console.ReadKey();
        }
    }
}
