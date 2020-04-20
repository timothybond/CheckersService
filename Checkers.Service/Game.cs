using System;
using System.Collections.Generic;

namespace Checkers.Service
{
    public class Game
    {
        public Game()
        {
            this.Id = "?";
            this.StartTime = DateTime.Now;
            this.RedName = "?";
            this.BlackName = "?";
            this.Moves = new List<GameMove>();
            this.CurrentPlayer = Color.Red;
            this.ActivePiece = null;
        }

        public string Id { get; set; }  

        public string RedName { get; set; }

        public string BlackName { get; set; }

        public DateTime StartTime { get; set; }

        public List<GameMove> Moves { get; set; }

        public Color CurrentPlayer { get; set; }

        public string? ActivePiece { get; set; }
    }
}
