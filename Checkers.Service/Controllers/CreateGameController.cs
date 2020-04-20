using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Net;

namespace Checkers.Service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CreateGameController : ControllerBase
    {
        private IMemoryCache cache;

        public CreateGameController(IMemoryCache cache)
        {
            this.cache = cache;
        }

        [HttpGet]
        public ActionResult<Game> Get()
        {
            var board = new Board();
            var game = new Game(board) { Id = GetUniqueId(), StartTime = DateTime.Now } ;

            cache.Set(
                game.Id,
                game,
                new MemoryCacheEntryOptions
                { 
                    SlidingExpiration = TimeSpan.FromHours(1.0),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1.0)
                });

            return game;
        }

        private string GetUniqueId()
        {
            var id = Guid.NewGuid().ToString();

            var tries = 0;

            while (cache.TryGetValue(id, out _))
            {
                id = Guid.NewGuid().ToString();
                tries++;

                if (tries > 100)
                {
                    throw new InvalidOperationException("Failed to generate unique id after 100 tries.");
                }
            }

            return id;
        }
    }
}
