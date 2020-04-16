using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Checkers.Service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoveController : ControllerBase
    {
        private IMemoryCache cache;

        public MoveController(IMemoryCache cache)
        {
            this.cache = cache;
        }

        [HttpPost()]
        public ActionResult<Game> Post(NewGameMove newMove)
        {
            Game game;

            if (cache.TryGetValue(newMove.GameId, out game))
            {
                // TODO: Allow other color to go first
                var board = new Board();

                foreach (var gameMove in game.Moves)
                {
                    var move = gameMove.ToMove();
                    board.Apply(move);
                }

                var movesToApply = newMove.Moves.Select(m => m.ToMove()).ToList();

                if (!board.Apply(movesToApply))
                {
                    return BadRequest($"Invalid move(s): {string.Join(", ", movesToApply.Select(m => m.ToString()))}");
                }

                // TODO: Verify this updates in the cache
                foreach (var appliedMove in movesToApply)
                {
                    game.Moves.Add(
                        new GameMove
                        {
                            Color = appliedMove.Color,
                            From = appliedMove.From.ToString(),
                            To = appliedMove.To.ToString()
                        });
                }

                return game;
            }
            else
            {
                return NotFound();
            }
        }
    }
}
