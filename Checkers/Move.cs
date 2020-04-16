using System;

namespace Checkers
{
    public class Move
    {
        public Move(Color color, Location from, Location to)
        {
            var offsetX = Math.Abs(to.X - from.X);
            var offsetY = Math.Abs(to.Y - from.Y);

            if (offsetX != offsetY)
            {
                throw new ArgumentException($"Invalid move - x and y offsets were not equal ({from} to {to}).");
            }

            if (offsetX < 1 || offsetX > 2)
            {
                throw new ArgumentException($"Invalid move - neither a single step nor a capture ({from} to {to}).");
            }

            Color = color;
            From = from;
            To = to;
        }

        /// <summary>
        /// Color of the moving player. (Must match piece at '<see cref="From"/>'.)
        /// </summary>
        public Color Color { get; }

        /// <summary>
        /// Initial piece location.
        /// </summary>
        public Location From { get; }

        /// <summary>
        /// Final piece location.
        /// </summary>
        public Location To { get; }

        public bool IsCapture => Math.Abs(this.To.X - this.From.X) == 2;

        public override string ToString()
        {
            return $"({From} {To})";
        }
    }
}
