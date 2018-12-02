using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Telegram.Bot;

namespace ChineseDuck.BotService.Root
{
    public class MainConfigurator
    {
        public MainConfigurator(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public IServiceProvider ServiceProvider { get; private set; }

        public void ConfigureServices(IServiceCollection services)
        {
            var botSettings = new BotSettingHolder(Configuration);
            var tClient = new TelegramBotClient(botSettings.TelegramBotKey)
                { Timeout = botSettings.PollingTimeout };

            services.AddSingleton(bS => botSettings);
            services.AddSingleton(cl => tClient);
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime applicationLifetime)
        {
            ServiceProvider = app.ApplicationServices;

            applicationLifetime.ApplicationStopping.Register(OnShutdown);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();

            var botSettings = ServiceProvider.GetRequiredService<BotSettingHolder>();
            var botBotClient = ServiceProvider.GetRequiredService<TelegramBotClient>();
            botBotClient.SetWebhookAsync(botSettings.WebhookPublicUrl + $"/{botSettings.TelegramBotKey}/Webhook").Wait();
        }

        private void OnShutdown()
        {
            var botBotClient = ServiceProvider.GetRequiredService<BotSettingHolder>();
            //botBotClient.DeleteWebhookAsync().Wait();
        }
    }
}
