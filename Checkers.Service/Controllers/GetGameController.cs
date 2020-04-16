using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;

namespace Checkers.Service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GetGameController : ControllerBase
    {
        private IMemoryCache cache;

        public GetGameController(IMemoryCache cache)
        {
            this.cache = cache;
        }

        [HttpGet("{id}")]
        public ActionResult<Game> Get(string id)
        {
            Game game;

            if (cache.TryGetValue(id, out game))
            {
                return game;
            }
            else
            {
                return NotFound();
            }
        }
    }
}
