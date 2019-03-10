using System;
using System.IO;
using System.Reflection;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.Bot.Rest.Repository;
using ChineseDuck.BotService.Commands;
using ChineseDuck.BotService.Commands.Common;
using ChineseDuck.BotService.MainExecution;
using ChineseDuck.Common.Logging;
using ChineseDuck.WebBot.Commands;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
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
        
        private string _releaseNotesInfo;
        private static string _currentDir;

        public string ReleaseNotesInfo
        {
            get
            {
                if (_releaseNotesInfo != null) return _releaseNotesInfo;

                var path = Path.Combine(CurrentDir, "ReleaseNotes.txt");
                _releaseNotesInfo = File.Exists(path) ? File.ReadAllText(path) : string.Empty;

                return _releaseNotesInfo;
            }
        }

        public string CurrentDir
        {
            get
            {
                if (_currentDir != null)
                    return _currentDir;

                var thisLocation = Assembly.GetCallingAssembly().Location;
                _currentDir = Path.GetDirectoryName(thisLocation);

                return _currentDir;
            }
        }

        public IConfiguration Configuration { get; }
        public IServiceProvider ServiceProvider { get; private set; }

        private CommandBase[] GetCommands()
        {
            return new CommandBase[]
            {
                //NinjectKernel.Get<DefaultCommand>(),
                //NinjectKernel.Get<ImportCommand>(),
                //NinjectKernel.Get<AddCommand>(),
                //NinjectKernel.Get<ViewCommand>(),
                //NinjectKernel.Get<DeleteCommand>(),
                ServiceProvider.GetRequiredService<HelpCommand>(),
                ServiceProvider.GetRequiredService<StartCommand>(),
                //NinjectKernel.Get<LearnWritingCommand>(),
                //NinjectKernel.Get<LearnViewCommand>(),
                //NinjectKernel.Get<AboutCommand>(),
                //NinjectKernel.Get<ModeCommand>(),
                //NinjectKernel.Get<LearnSpeakCommand>(),
                //NinjectKernel.Get<LearnTranslationCommand>(),
                //NinjectKernel.Get<EditCommand>()
            };
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var botSettings = new BotSettingHolder(Configuration);
            var tClient = new TelegramBotClient(botSettings.TelegramBotKey)
                { Timeout = botSettings.PollingTimeout };

            var apiClient = new ApiClient(botSettings.ApiPublicUrl);
            var wordApi = new WordApi(apiClient);
            var userApi = new UserApi(apiClient);
            var serviceApi = new ServiceApi(apiClient);
            var folderApi = new FolderApi(apiClient);
            var log4NetService = new Log4NetService();
            var restWordRepository = new RestWordRepository(wordApi, userApi, serviceApi, folderApi);
            var antiDdosChecker = new AntiDdosChecker(GetDateTime);
            var commandManager = new CommandManager(GetCommands);

            apiClient.OnAuthenticationRequest += (o, e) =>
            {
                userApi.LoginUser(new ApiUser { Code = botSettings.UserId.ToString(), Id = botSettings.Password });
            };

            services.AddSingleton(a => antiDdosChecker);
            services.AddSingleton(bS => botSettings);
            services.AddSingleton(cl => tClient);
            services.AddSingleton<ICommandManager>(commandManager);
            services.AddSingleton<ILogService>(log4NetService);
            services.AddSingleton<IWordRepository>(restWordRepository);

            var flashCardUrl = $"{botSettings.ApiPublicUrl}/word/file";

            services.AddSingleton(qh =>
                new QueryHandler(tClient, log4NetService, restWordRepository, antiDdosChecker, flashCardUrl, commandManager));

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
            botBotClient.SetWebhookAsync($"{botSettings.WebhookPublicUrl}/{botSettings.TelegramBotKey}/Webhook").Wait();
        }

        private void OnShutdown()
        {
            var botClient = ServiceProvider.GetRequiredService<TelegramBotClient>();
            botClient.DeleteWebhookAsync().Wait();
        }

        public static DateTime GetDateTime()
        {
            return DateTime.Now;
        }
    }
}
