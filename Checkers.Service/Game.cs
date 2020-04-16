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
        }

        public string Id { get; set; }  

        public string RedName { get; set; }

        public string BlackName { get; set; }

        public DateTime StartTime { get; set; }

        public List<GameMove> Moves { get; set; }
    }
}
