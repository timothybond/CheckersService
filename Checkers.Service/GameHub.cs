using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Checkers.Service
{
    public class GameHub : Hub<IGameClient>
    {
        private IMemoryCache cache;

        public GameHub(IMemoryCache cache)
        {
            this.cache = cache;
        }

        public async Task StartGame()
        {
            var board = new Board();
            var game = new Game(board) { Id = GetUniqueId(), StartTime = DateTime.Now };

            cache.Set(
                game.Id,
                game,
                new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromHours(1.0),
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1.0)
                });

            await Groups.AddToGroupAsync(Context.ConnectionId, game.Id);
            await Clients.Group(game.Id).UpdateClient(game);
        }

        public async Task JoinGame(string gameId)
        {
            Game game;

            if (cache.TryGetValue(gameId, out game))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, game.Id);
                await Clients.Group(game.Id).UpdateClient(game);
            }
            else
            {
                await Clients.Caller.SendError($"Game '{gameId}' not found.");
            }
        }

        public async Task Move(NewGameMove newMove)
        {
            Game game;

            if (!cache.TryGetValue(newMove.GameId, out game))
            {
                await Clients.Caller.SendError($"Game '{newMove.GameId}' not found.");
                return;
            }

            if (game.Winner != null)
            {
                await Clients.Caller.SendError($"Game '{newMove.GameId}' has already ended.");
                return;
            }

            var board = new Board();

            foreach (var gameMove in game.Moves)
            {
                if (gameMove == null)
                {
                    board.Pass();
                }
                else
                {
                    var move = gameMove.ToMove();
                    board.Apply(move);
                }
            }

            var moveToApply = newMove.Move.ToMove();

            if (!board.Apply(moveToApply))
            {
                await Clients.Caller.SendError($"Invalid move: {moveToApply}");
                return;
            }

            game.Moves.Add(newMove.Move);
            game = new Game(board, game);

            cache.Set(game.Id, game);

            await Clients.Group(game.Id).UpdateClient(game);
        }

        public async Task Pass(PassMove passMove)
        {
            Game game;

            if (!cache.TryGetValue(passMove.GameId, out game))
            {
                await Clients.Caller.SendError($"Game '{passMove.GameId}' not found.");
                return;
            }

            if (game.Winner != null)
            {
                await Clients.Caller.SendError($"Game '{passMove.GameId}' has already ended.");
                return;
            }

            var board = new Board();

            foreach (var gameMove in game.Moves)
            {
                if (gameMove == null)
                {
                    board.Pass();
                }
                else
                {
                    var move = gameMove.ToMove();
                    board.Apply(move);
                }
            }

            if (!board.Pass())
            {
                await Clients.Caller.SendError(
                    "Invalid attempt to pass (i.e., no move received, but player " +
                    "has not just done a capture with a possible follow-up).");
                return;
            }

            game.Moves.Add(null);
            game = new Game(board, game);

            cache.Set(game.Id, game);

            await Clients.Group(game.Id).UpdateClient(game);
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
