using System;
using System.IO;
using System.Reflection;
using chineseDuck.BotService.Commands;
using chineseDuck.BotService.Commands.Common;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Providers;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.Bot.Rest.Repository;
using ChineseDuck.BotService.MainExecution;
using ChineseDuck.Common.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Telegram.Bot;
using YellowDuck.LearnChinese.Providers;

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
            var cmd =
                new CommandBase[]
                {
                    ServiceProvider.GetService<DefaultCommand>(),
                    ServiceProvider.GetService<ImportCommand>(),
                    ServiceProvider.GetService<AddCommand>(),
                    ServiceProvider.GetService<ViewCommand>(),
                    ServiceProvider.GetService<DeleteCommand>(),
                    ServiceProvider.GetService<HelpCommand>(),
                    ServiceProvider.GetService<StartCommand>(),
                    ServiceProvider.GetService<LearnWritingCommand>(),
                    ServiceProvider.GetService<LearnViewCommand>(),
                    ServiceProvider.GetService<AboutCommand>(),
                    ServiceProvider.GetService<ModeCommand>(),
                    ServiceProvider.GetService<LearnSpeakCommand>(),
                    ServiceProvider.GetService<LearnTranslationCommand>(),
                    ServiceProvider.GetService<EditCommand>()
                };

            return cmd;
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
                userApi.LoginUser(new ApiUser {Code = botSettings.Password, Id = botSettings.UserId.ToString()});
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

            services.AddSingleton<ISyllableColorProvider, ClassicSyllableColorProvider>();
            services.AddSingleton<IChineseWordParseProvider, PinyinChineseWordParseProvider>();
            services.AddSingleton<IStudyProvider, ClassicStudyProvider>();
            services.AddSingleton<ISyllablesToStringConverter, ClassicSyllablesToStringConverter>();
            services.AddSingleton<IChinesePinyinConverter, Pinyin4NetConverter>();
            services.AddSingleton<IFlashCardGenerator, FontFlashCardGenerator>();

            services.AddTransient(a => new AboutCommand(ReleaseNotesInfo));
            services.AddTransient(a => new HelpCommand(GetCommands));
            services.AddTransient(a => new StartCommand(GetCommands));

            services.AddTransient(a => new DefaultCommand(ServiceProvider.GetService<IWordRepository>()));
            services.AddTransient(a => new ImportCommand(ServiceProvider.GetService<IChineseWordParseProvider>(),
                ServiceProvider.GetService<IWordRepository>(), ServiceProvider.GetService<IFlashCardGenerator>()));
            services.AddTransient(a => new AddCommand(ServiceProvider.GetService<IChineseWordParseProvider>(), ServiceProvider.GetService<IWordRepository>(), ServiceProvider.GetService<IFlashCardGenerator>()));
            services.AddTransient(a => new ViewCommand(ServiceProvider.GetService<IWordRepository>()));
            services.AddTransient(a => new DeleteCommand(ServiceProvider.GetService<IWordRepository>()));
            services.AddTransient(a => new EditCommand(ServiceProvider.GetService<IWordRepository>(),
                ServiceProvider.GetService<IChineseWordParseProvider>(), ServiceProvider.GetService<ImportCommand>(),
                ServiceProvider.GetService<IFlashCardGenerator>()));
            services.AddTransient(a => new LearnWritingCommand(ServiceProvider.GetService<IStudyProvider>(),
                ServiceProvider.GetService<EditCommand>()));
            services.AddTransient(a => new LearnViewCommand(ServiceProvider.GetService<IStudyProvider>(),
                ServiceProvider.GetService<EditCommand>()));
            services.AddTransient(a => new LearnSpeakCommand(ServiceProvider.GetService<IStudyProvider>(),
                ServiceProvider.GetService<EditCommand>()));
            services.AddTransient(a => new LearnTranslationCommand(ServiceProvider.GetService<IStudyProvider>(),
                ServiceProvider.GetService<EditCommand>()));
            services.AddTransient(a => new ModeCommand(ServiceProvider.GetService<IWordRepository>()));

            services.AddSingleton(a => new AntiDdosChecker(GetDateTime));

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
