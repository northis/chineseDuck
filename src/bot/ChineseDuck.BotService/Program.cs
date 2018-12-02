using System.Net;
using ChineseDuck.BotService.Root;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace ChineseDuck.BotService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var webHostBuilder = WebHost.CreateDefaultBuilder(args)
                .UseStartup<MainConfigurator>();
            
            webHostBuilder.UseKestrel(options =>
            {
                var botSettings = options.ApplicationServices.GetRequiredService<BotSettingHolder>();
                options.Listen(IPAddress.Any, botSettings.LocalPort);
            });

            var webHost = webHostBuilder.Build();
            webHost.Run();
            WebHostSingleton = webHost;
            
        }

        public static IWebHost WebHostSingleton  { get; private set; }
    }
}
