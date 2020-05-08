using System;
using System.Collections.Generic;
using System.Linq;

namespace Checkers.Service.Model
{
    public class Game
    {
        public Game()
        {
            this.Id = "?";
            this.StartTime = DateTime.Now;
            this.WhiteName = "?";
            this.BlackName = "?";
            this.Moves = new List<Move?>();
            this.CurrentPlayer = Color.White;
            this.ValidMoves = new List<Move>();
            this.ActivePiece = null;
        }

        public Game(Board board) : this()
        {
            this.CurrentPlayer = board.CurrentPlayer;
            this.ActivePiece = board.ActivePiece?.ToString();
            this.ValidMoves =
                board
                    .GetValidMoves()
                    .Select(m => new Move(m))
                    .ToList();
            this.Winner = board.Winner;
        }

        public Game(Board board, Game game)
        {
            this.CurrentPlayer = board.CurrentPlayer;
            this.ActivePiece = board.ActivePiece?.ToString();
            this.ValidMoves =
                board
                    .GetValidMoves()
                    .Select(m => new Move(m))
                    .ToList();
            this.Winner = board.Winner;

            this.Id = game.Id;
            this.Moves = new List<Move?>(game.Moves);
            this.WhiteName = game.WhiteName;
            this.BlackName = game.BlackName;
            this.StartTime = game.StartTime;
        }

        public string Id { get; set; }  

        public string WhiteName { get; set; }

        public string BlackName { get; set; }

        public DateTime StartTime { get; set; }

        /// <summary>
        /// List of moves so far, or <c>null</c> for a pass.
        /// </summary>
        public List<Move?> Moves { get; set; }

        public Color CurrentPlayer { get; set; }

        public string? ActivePiece { get; set; }

        public List<Move> ValidMoves { get; set; }

        public Color? Winner { get; set; }
    }
}
