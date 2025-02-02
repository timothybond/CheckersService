﻿using System;

namespace Checkers
{
    // TODO: Make a struct without losing the safety on X/Y values
    public class Location
    {
        /// <summary>
        /// Used to convert to/from "chess notation" for locations.
        /// </summary>
        private const string horizontals = "abcdefgh";

        public Location(int x, int y)
        {
            if (x < 0 || y < 0 || x > 7 || y > 7)
            {
                throw new ArgumentException("Positions must be from 0 to 7.");
            }

            this.X = x;
            this.Y = y;
        }

        /// <summary>
        /// Horizontal position (from left to right, zero-indexed).
        /// </summary>
        public int X { get; }

        /// <summary>
        /// Vertical position (from bottom to top, zero-indexed).
        /// </summary>
        public int Y { get; }

        public override string ToString()
        {
            // Using standard chess notation, a-h across the top, 1-8 up the side.
            var vertical = 8 - Y;

            return $"{horizontals[X]}{vertical}";
        }

        /// <summary>
        /// Gets a location from a chess-notation-style string, i.e. "a1" through "h8".
        /// </summary>
        public static Location FromString(string s)
        {
            const string verticals = "87654321";

            if (s == null)
            {
                throw new ArgumentNullException();
            }

            if (s.Length != 2)
            {
                throw new ArgumentException($"Location string must be two characters (was '{s}').");
            }

            var horizontalIndex = horizontals.IndexOf(s.ToLower()[0]);

            if (horizontalIndex < 0)
            {
                throw new ArgumentException($"Location string must start with a letter from 'a' through 'h' (was '{s}').");
            }

            var verticalIndex = verticals.IndexOf(s[1]);

            if (verticalIndex < 0)
            {
                throw new ArgumentException($"Location string must end with a number from from '1' through '8' (was '{s}').");
            }

            return new Location(horizontalIndex, verticalIndex);
        }

        public override int GetHashCode()
        {
            return this.X << 3 | this.Y;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null)
            {
                return false;
            }

            if (obj is Location loc)
            {
                return this.X == loc.X && this.Y == loc.Y;
            }

            return false;
        }

        public static Location? operator +(Location location, Offset offset)
        {
            var x = location.X + offset.X;
            var y = location.Y + offset.Y;

            if (x < 0 || y < 0 || x > 7 || y > 7)
            {
                return null;
            }

            return new Location(x, y);
        }
    }
}
