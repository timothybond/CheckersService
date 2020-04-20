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

                if (newMove.Move == null)
                {
                    if (!board.Pass())
                    {
                        return BadRequest(
                            "Invalid attempt to pass (i.e., no move received, but player " +
                            "has not just done a capture with a possible follow-up).");
                    }
                }
                else
                {
                    var moveToApply = newMove.Move.ToMove();

                    if (!board.Apply(moveToApply))
                    {
                        return BadRequest($"Invalid move: {moveToApply}");
                    }

                    game.Moves.Add(newMove.Move);
                }

                game.CurrentPlayer = board.CurrentPlayer;
                game.ActivePiece = board.ActivePiece?.ToString();

                return game;
            }
            else
            {
                return NotFound();
            }
        }
    }
}
