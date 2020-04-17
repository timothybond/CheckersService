using System;

namespace Checkers
{
    // TODO: Make a struct without losing the safety on values (maybe eliminate "None" values?)
    public class Piece
    {
        public Piece(PieceType type, Color color)
        {
            this.Type = type;
            this.Color = color;
        }

        public PieceType Type { get; set; }

        public Color Color { get; }

        public override string ToString()
        {
            if (this.Color == Color.Red)
            {
                return this.Type == PieceType.Piece ? "r" : "R";
            }
            else
            {
                return this.Type == PieceType.Piece ? "b" : "B";
            };
        }
    }
}
