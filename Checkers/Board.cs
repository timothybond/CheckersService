using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Checkers
{
    /// <summary>
    /// Contains the current state of a Checkers board.
    /// 
    /// Assumes <see cref="Color.Black"/> starts at the top and <see cref="Color.Red"/> at the bottom.
    /// </summary>
    public class Board
    {
        private static readonly IReadOnlyList<Offset> ValidMoveOffsets = new List<Offset>
            {
                new Offset { X = 1, Y = 1},
                new Offset { X = 1, Y = -1},
                new Offset { X = -1, Y = 1},
                new Offset { X = -1, Y = -1},
                new Offset { X = 2, Y = 2},
                new Offset { X = 2, Y = -2},
                new Offset { X = -2, Y = 2},
                new Offset { X = -2, Y = -2}
            };

        Piece?[,] pieces;

        public Board()
        {
            this.pieces = new Piece?[8, 8];
            this.ResetGame();
        }

        /// <summary>
        /// Hidden constructor to let us run the game forward to get valid moves.
        /// </summary>
        /// <param name="pieces"></param>
        private Board(Piece?[,] pieces, Color currentPlayer)
        {
            this.pieces = (Piece?[,])pieces.Clone();
            this.CurrentPlayer = currentPlayer;
        }

        public void ResetGame(Color? firstPlayer = null)
        {
            this.CurrentPlayer = firstPlayer ?? Color.Red;

            // Default piece locations:
            // Black on the bottom (high index),
            // Red on the top (low index),
            // even spaces filled.
            for (var redRow = 0; redRow < 3; redRow++)
            {
                for (var x = 0; x < 8; x++)
                {
                    if ((x + redRow) % 2 == 0)
                    {
                        this[x, redRow] = new Piece(PieceType.Piece, Color.Red);
                    }
                }
            }

            for (var blackRow = 5; blackRow < 8; blackRow++)
            {
                for (var x = 0; x < 8; x++)
                {
                    if ((x + blackRow) % 2 == 0)
                    {
                        this[x, blackRow] = new Piece(PieceType.Piece, Color.Black);
                    }
                }
            }
        }

        public void Clear()
        {
            for (var y = 0; y < 8; y++)
            {
                for (var x = 0; x < 8; x++)
                {
                    this[x, y] = null;
                }
            }
        }

        public Color CurrentPlayer { get; private set; }

        public Piece? this[int x, int y]
        {
            // Note this applies range checks
            get
            {
                return this[new Location(x, y)];
            }
            set
            {
                this[new Location(x, y)] = value;
            }
        }

        public Piece? this[Location location]
        {
            get
            {
                return this.pieces[location.X, location.Y];
            }
            set
            {
                this.pieces[location.X, location.Y] = value;
            }
        }

        public Location? ActivePiece { get; private set; }

        /// <summary>
        /// If the move is valid, applies it and returns <c>true</c>. Otherwise, returns <c>false</c>.
        /// </summary>
        public bool Apply(Move move)
        {
            if (!this.IsValid(move))
            {
                return false;
            }

            this[move.To] = this[move.From];
            this[move.From] = null;

            if (Math.Abs(move.To.Y - move.From.Y) == 2)
            {
                var middle = GetMiddle(move.From, move.To);
                this[middle] = null;
            }

            if ((move.To.Y == 0 && move.Color == Color.Black) ||
                (move.To.Y == 7 && move.Color == Color.Red))
            {
                var piece = this[move.To];

                if (piece != null)
                {
                    piece.Type = PieceType.King;
                }
                else
                {
                    throw new InvalidOperationException("Board state corrupted somehow.");
                }
            }

            if (move.IsCapture)
            {
                this.ActivePiece = move.To;

                if (!this.GetValidMoves().Any())
                {
                    this.SetNextPlayer();
                }
            }
            else
            {
                this.SetNextPlayer();
            }

            return true;
        }

        /// <summary>
        /// Passes control to the next player.
        /// 
        /// Only valid after a capture that would allow another capture,
        /// where the active player chooses to forego that capture.
        /// </summary>
        /// <returns><c>true</c> if this was a valid attempt to pass, <c>false</c> otherwise.</returns>
        public bool Pass()
        {
            if (this.ActivePiece == null)
            {
                return false;
            }

            this.SetNextPlayer();

            return true;
        }

        private void SetNextPlayer()
        {
            this.ActivePiece = null;
            this.CurrentPlayer = this.CurrentPlayer == Color.Black ? Color.Red : Color.Black;
        }

        /// <summary>
        /// Gets all valid moves for the current player (and, if appropriate, the last moved piece).
        /// </summary>
        /// <returns></returns>
        public List<Move> GetValidMoves()
        {
            var results = new List<Move>();

            if (this.ActivePiece != null)
            {
                results.AddRange(
                    this.GetValidMoves(this.ActivePiece.X, this.ActivePiece.Y)
                        .Where(m => m.IsCapture));
                return results;
            }

            for (var x = 0; x < 8; x++)
            {
                for (var y = 0; y < 8; y++)
                {
                    if (this[x, y]?.Color == this.CurrentPlayer)
                    {
                        results.AddRange(this.GetValidMoves(x, y));
                    }
                }
            }

            return results;
        }

        private List<Move> GetValidMoves(int x, int y)
        {
            var results = new List<Move>();

            if (this[x, y]?.Color == this.CurrentPlayer)
            {
                var from = new Location(x, y);

                results.AddRange(
                    ValidMoveOffsets
                        .Select(offset => from + offset)
                        .OfType<Location>()
                        .Select(to => new Move(this.CurrentPlayer, from, to))
                        .Where(move => this.IsValid(move)));
            }

            return results;
        }

        /// <summary>
        /// Checks if the specified move is valid based on the current state of the board.
        /// </summary>
        /// <param name="move"></param>
        /// <returns></returns>
        public bool IsValid(Move move)
        {
            if (move.Color != this.CurrentPlayer)
            {
                return false;
            }

            var piece = this[move.From];

            if (piece == null || piece.Color != move.Color)
            {
                return false;
            }

            if (piece.Type == PieceType.Piece)
            {
                // Red moves to higher numbers, Black to lower
                var forward = move.Color == Color.Red ? 1 : -1;
                
                if ((move.To.Y - move.From.Y) * forward < 0)
                {
                    return false;
                }
            }

            // Either we should be moving 1 offset in both directions to an empty space,
            // or 2 offset in both directions and over an opponent.
            var xOffset = Math.Abs(move.To.X - move.From.X);
            var yOffset = Math.Abs(move.To.Y - move.From.Y);

            if (xOffset != yOffset)
            {
                return false;
            }

            if (xOffset == 1)
            {
                return this[move.To] == null;
            }
            
            if (xOffset != 2)
            {
                return false;
            }

            return JumpsOpponent(move);
        }

        private bool JumpsOpponent(Move move)
        {
            var middle = GetMiddle(move.From, move.To);

            var middlePiece = this[middle];

            return middlePiece != null && middlePiece.Color != move.Color;
        }

        private static Location GetMiddle(Location first, Location second)
        {
            return new Location((first.X + second.X) / 2, (first.Y + second.Y) / 2);
        }

        public override string ToString()
        {
            var sb = new StringBuilder();

            sb.Append("-----------------");
            for (var y = 0; y < 8; y++)
            {
                sb.AppendLine();
                for (var x = 0; x < 8; x++)
                {
                    sb.Append('|');
                    sb.Append(this[x, y]?.ToString() ?? " ");
                }
                sb.AppendLine("|");
                sb.Append("-----------------");
            }

            return sb.ToString();
        }
    }
}
