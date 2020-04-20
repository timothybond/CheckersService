using System;
using System.Collections.Generic;
using System.Text;

namespace Checkers
{
    /// <summary>
    /// A possible move the current player can take, including any potential chained moves.
    /// </summary>
    public class ValidMove : Move
    {
        public ValidMove(Move move) : base(move.Color, move.From, move.To)
        {
            this.ChainedMoves = new List<ValidMove>();
        }

        public ValidMove(Color color, Location from, Location to) : base(color, from, to)
        {
            this.ChainedMoves = new List<ValidMove>();
        }

        public List<ValidMove> ChainedMoves { get; }
    }
}
