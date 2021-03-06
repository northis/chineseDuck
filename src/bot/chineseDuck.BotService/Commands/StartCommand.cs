using System;
using chineseDuck.BotService.Commands.Common;
using chineseDuck.BotService.Commands.Enums;

namespace chineseDuck.BotService.Commands
{
    public class StartCommand : HelpCommand
    {
        private readonly string _website;

        public StartCommand(Func<CommandBase[]> getAllCommands, string website) : base(getAllCommands)
        {
            _website = website;
        }

        public override string GetCommandIconUnicode()
        {
            return "🖐";
        }

        public override string GetCommandTextDescription()
        {
            return "Welcome";
        }

        public override ECommands GetCommandType()
        {
            return ECommands.Start;
        }

        public override string GetHelpMessage()
        {
            return
                $"Welcome to Chinese Duck Bot! {Environment.NewLine}It will help you learn chinese words by memorizing flash cards. {Environment.NewLine}You have your personal dictionary, feel free to fill it with your own words. You can provide suitable translation on your native language. And this bot will parse and check all the words you gave, highlight tones with colors and check your score in learning words. One 'word' must be less than 15 characters, so you can learn even short sentences. {Environment.NewLine}It is beta version of the program, so I will be glad if you contact me @DeathWhinny in case of bugs. Happy studying!{Environment.NewLine}{Environment.NewLine}BTW, check out new web-part of this bot: {_website}. There you can manage your own word folders and view them more interactive!{Environment.NewLine}{Environment.NewLine}List of available commands:{Environment.NewLine}{base.GetHelpMessage()}";
        }
    }
}