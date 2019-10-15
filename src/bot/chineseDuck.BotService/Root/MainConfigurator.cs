using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using chineseDuck.Bot.Security;
using chineseDuck.BotService.Commands;
using chineseDuck.BotService.Commands.Common;
using ChineseDuck.Bot.Interfaces;
using ChineseDuck.Bot.Providers;
using ChineseDuck.Bot.Rest.Api;
using ChineseDuck.Bot.Rest.Client;
using ChineseDuck.Bot.Rest.Model;
using ChineseDuck.Bot.Rest.Repository;
using chineseDuck.BotService.Commands.Enums;
using ChineseDuck.BotService.MainExecution;
using ChineseDuck.Common.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
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
        private string _aboutInfo;
        private string _preInstalledFolder;

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
        public string PreInstalledFolder
        {
            get
            {
                if (_preInstalledFolder != null) return _preInstalledFolder;

                _preInstalledFolder = Path.Combine(CurrentDir, "Hsk");
                return _preInstalledFolder;
            }
        }

        public string AboutInfo
        {
            get
            {
                if (_aboutInfo != null) return _aboutInfo;

                var path = Path.Combine(CurrentDir, "package.json");
                if (File.Exists(path))
                {
                    dynamic json = JObject.Parse(File.ReadAllText(path));
                    _aboutInfo = $"{json.description} ver. {json.version}{Environment.NewLine}Author: {json.author}{Environment.NewLine}Contact me: @DeathWhinny{Environment.NewLine}Web-part: {json.url}{Environment.NewLine}Github: {json.homepage} {Environment.NewLine}";
                }
                else
                {
                    _aboutInfo = string.Empty;
                }

                return _aboutInfo;
            }
        }

        public string CurrentDir => AppDomain.CurrentDomain.BaseDirectory;
        public uint MaxUploadFileSize => 8192;

        public IConfiguration Configuration { get; }
        public IServiceProvider ServiceProvider { get; private set; }

        private CommandBase[] GetCommands()
        {
            return new CommandBase[]
            {
                ServiceProvider.GetService<AboutCommand>(),
                ServiceProvider.GetService<AddCommand>(),
                ServiceProvider.GetService<AdminCommand>(),
                ServiceProvider.GetService<DefaultCommand>(),
                ServiceProvider.GetService<DeleteCommand>(),
                ServiceProvider.GetService<EditCommand>(),
                ServiceProvider.GetService<FolderCommand>(),
                ServiceProvider.GetService<ImportCommand>(),
                ServiceProvider.GetService<HelpCommand>(),
                ServiceProvider.GetService<LearnSpeakCommand>(),
                ServiceProvider.GetService<LearnTranslationCommand>(),
                ServiceProvider.GetService<LearnViewCommand>(),
                ServiceProvider.GetService<LearnWritingCommand>(),
                ServiceProvider.GetService<ModeCommand>(),
                ServiceProvider.GetService<PreInstallCommand>(),
                ServiceProvider.GetService<StartCommand>(),
                ServiceProvider.GetService<ViewCommand>(),
                ServiceProvider.GetService<WebCommand>()
            }; ;
        }

        private CommandBase[] GetHiddenCommands()
        {
            return new CommandBase[]
            {
                ServiceProvider.GetService<AdminCommand>()
            };
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var botSettings = new BotSettingHolder(Configuration);
            var tClient = new TelegramBotClient(botSettings.TelegramBotKey)
                { Timeout = botSettings.PollingTimeout };

            var apiClient = new ApiClient(botSettings.ApiPublicUrl);
            var wordApi = new WordApi(apiClient);
            var signer = new AuthSigner(botSettings.TelegramBotKey);
            var userApi = new UserApi(apiClient, signer);
            var serviceApi = new ServiceApi(apiClient);
            var folderApi = new FolderApi(apiClient);
            var log4NetService = new Log4NetService();
            var restWordRepository = new RestWordRepository(wordApi, userApi, serviceApi, folderApi);
            var antiDdosChecker = new AntiDdosChecker(GetDateTime);

            var commandManager = new CommandManager(GetCommands, GetHiddenCommands,
                new Dictionary<string, ECommands> {{botSettings.ServiceCommandPassword, ECommands.Admin}});

            apiClient.OnAuthenticationRequest += (o, e) =>
            {
                userApi.LoginUser(new ApiUser {Id = botSettings.UserId.ToString()});
            };

            services.AddSingleton(a => antiDdosChecker);
            services.AddSingleton(bS => botSettings);
            services.AddSingleton(cl => tClient);
            services.AddSingleton<ICommandManager>(commandManager);
            services.AddSingleton<ILogService>(log4NetService);
            services.AddSingleton<IWordRepository>(restWordRepository);

            var flashCardUrl = $"{botSettings.ApiPublicUrl}/word/file";
            services.AddSingleton(qh =>
                new QueryHandler(tClient, log4NetService, restWordRepository, antiDdosChecker, flashCardUrl, commandManager, MaxUploadFileSize));

            services.AddSingleton<ISyllableColorProvider, ClassicSyllableColorProvider>();
            services.AddSingleton<IChineseWordParseProvider, PinyinChineseWordParseProvider>();
            services.AddSingleton<IStudyProvider, ClassicStudyProvider>();
            services.AddSingleton<ISyllablesToStringConverter, ClassicSyllablesToStringConverter>();
            services.AddSingleton<IChinesePinyinConverter, Pinyin4NetConverter>();
            services.AddSingleton<IFlashCardGenerator, FontFlashCardGenerator>();

            services.AddTransient(a => new AboutCommand(ReleaseNotesInfo, AboutInfo));
            services.AddTransient(a => new HelpCommand(GetCommands));
            services.AddTransient(a => new StartCommand(GetCommands, botSettings.WebhookPublicUrl));
            services.AddTransient(a => new FolderCommand(ServiceProvider.GetService<IWordRepository>(), botSettings.FolderManagementText));

            services.AddTransient(a => new DefaultCommand(ServiceProvider.GetService<IWordRepository>()));
            services.AddTransient(a => new ImportCommand(ServiceProvider.GetService<IChineseWordParseProvider>(),
                ServiceProvider.GetService<IWordRepository>(), ServiceProvider.GetService<IFlashCardGenerator>(),
                MaxUploadFileSize));
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

            services.AddTransient(a => new PreInstallCommand(ServiceProvider.GetService<IWordRepository>()));

            services.AddTransient(a => new AdminCommand(ServiceProvider.GetService<IChineseWordParseProvider>(),
                ServiceProvider.GetService<IWordRepository>(), ServiceProvider.GetService<IFlashCardGenerator>(),
                MaxUploadFileSize, PreInstalledFolder, botSettings.ServerUserId, botSettings.AdminUserId));
            services.AddTransient(a => new WebCommand(signer, botSettings.ApiPublicUrl));

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
