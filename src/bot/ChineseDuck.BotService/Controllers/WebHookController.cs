using System.Collections.Generic;
using System.Threading.Tasks;
using ChineseDuck.BotService.Helpers;
using ChineseDuck.BotService.MainExecution;
using Microsoft.AspNetCore.Mvc;
using Telegram.Bot.Types;

namespace ChineseDuck.BotService.Controllers
{
    [Webhook]
    [ApiController]
    public class WebHookController : ControllerBase
    {
        private readonly QueryHandler _queryHandler;

        public WebHookController(QueryHandler queryHandler)
        {
            _queryHandler = queryHandler;
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new [] { "value1", "value2" };
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(Update update)
        {
            if (update.Message != null)
                await _queryHandler.OnMessage(update.Message);

            if (update.CallbackQuery != null)
                await _queryHandler.CallbackQuery(update.CallbackQuery);

            if (update.InlineQuery != null)
                await _queryHandler.InlineQuery(update.InlineQuery);


            return Ok();
        }
    }
}
