using NUnit.Framework;
using System.Collections.Generic;

namespace Checkers.UnitTests
{
    public class BoardTests
    {
        [Test]
        public void NewBoard_ToString_Matches()
        {
            var expected =
                "-----------------\r\n" +
                "|r| |r| |r| |r| |\r\n" +
                "-----------------\r\n" +
                "| |r| |r| |r| |r|\r\n" +
                "-----------------\r\n" +
                "|r| |r| |r| |r| |\r\n" +
                "-----------------\r\n" +
                "| | | | | | | | |\r\n" +
                "-----------------\r\n" +
                "| | | | | | | | |\r\n" +
                "-----------------\r\n" +
                "| |b| |b| |b| |b|\r\n" +
                "-----------------\r\n" +
                "|b| |b| |b| |b| |\r\n" +
                "-----------------\r\n" +
                "| |b| |b| |b| |b|\r\n" +
                "-----------------";

            var board = new Board();

            Assert.AreEqual(expected, board.ToString());
        }

        [Test]
        [TestCase(0, 0, Color.Red)]
        [TestCase(2, 0, Color.Red)]
        [TestCase(4, 0, Color.Red)]
        [TestCase(6, 0, Color.Red)]
        [TestCase(1, 1, Color.Red)]
        [TestCase(3, 1, Color.Red)]
        [TestCase(5, 1, Color.Red)]
        [TestCase(7, 1, Color.Red)]
        [TestCase(0, 2, Color.Red)]
        [TestCase(2, 2, Color.Red)]
        [TestCase(4, 2, Color.Red)]
        [TestCase(6, 2, Color.Red)]
        [TestCase(1, 5, Color.Black)]
        [TestCase(3, 5, Color.Black)]
        [TestCase(5, 5, Color.Black)]
        [TestCase(7, 5, Color.Black)]
        [TestCase(0, 6, Color.Black)]
        [TestCase(2, 6, Color.Black)]
        [TestCase(4, 6, Color.Black)]
        [TestCase(6, 6, Color.Black)]
        [TestCase(1, 7, Color.Black)]
        [TestCase(3, 7, Color.Black)]
        [TestCase(5, 7, Color.Black)]
        [TestCase(7, 7, Color.Black)]
        public void NewBoard_HasExpectedPieces(int x, int y, Color color)
        {
            var board = new Board();

            Assert.AreEqual(color, board[x, y]?.Color);
        }

        [Test]
        public void NewBoard_HasExpectedEmptySpaces()
        {
            var board = new Board();

            for (var y = 0; y < 8; y++)
            {
                for (var x = 0; x < 8; x++)
                {
                    if (y == 3 || y == 4 || (x + y) % 2 == 1)
                    {
                        Assert.IsNull(board[x, y]);
                    }
                }
            }
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3)]
        [TestCase(Color.Black, 3, 5, 5, 3)]
        [TestCase(Color.Red, 4, 2, 2, 4)]
        [TestCase(Color.Red, 4, 2, 6, 4)]
        public void IsValid_AllowsCaptures(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.Red ? Color.Black : Color.Red);

            Assert.AreEqual(true, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 1, 5, 2, 4)]
        [TestCase(Color.Black, 1, 5, 0, 4)]
        [TestCase(Color.Red, 4, 2, 3, 3)]
        [TestCase(Color.Red, 4, 2, 5, 3)]
        public void IsValid_AllowsForwardMove(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            Assert.AreEqual(true, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 1, 5, 2, 6)]
        [TestCase(Color.Black, 1, 5, 0, 6)]
        [TestCase(Color.Red, 4, 2, 3, 1)]
        [TestCase(Color.Red, 4, 2, 5, 1)]
        public void IsValid_DisallowsBackwardMove(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            Assert.AreEqual(false, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 1, 5, 2, 6)]
        [TestCase(Color.Black, 1, 5, 0, 6)]
        [TestCase(Color.Red, 4, 2, 3, 1)]
        [TestCase(Color.Red, 4, 2, 5, 1)]
        public void IsValid_AllowsBackwardMoveForKing(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.King, color);

            Assert.AreEqual(true, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 1, 5, 2, 4)]
        [TestCase(Color.Black, 1, 5, 0, 4)]
        [TestCase(Color.Red, 4, 2, 3, 3)]
        [TestCase(Color.Red, 4, 2, 5, 3)]
        [TestCase(Color.Black, 1, 5, 2, 6)]
        [TestCase(Color.Black, 1, 5, 0, 6)]
        [TestCase(Color.Red, 4, 2, 3, 1)]
        [TestCase(Color.Red, 4, 2, 5, 1)]
        public void Apply_MovesPiece(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.King, color);

            Assert.AreEqual(true, board.Apply(move));

            Assert.IsNull(board[from]);
            Assert.AreEqual(color, board[to]?.Color);
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3)]
        [TestCase(Color.Black, 3, 5, 5, 3)]
        [TestCase(Color.Red, 4, 2, 2, 4)]
        [TestCase(Color.Red, 4, 2, 6, 4)]
        public void Apply_RemovesCapturedPiece(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.Red ? Color.Black : Color.Red);

            Assert.AreEqual(true, board.Apply(move));

            Assert.IsNull(board[middle]);
        }

        [Test]
        public void ApplyMany_AllowsMultiCapture()
        {
            var board = GetEmptyBoard(Color.Red);
            board[0, 0] = new Piece(PieceType.Piece, Color.Red);
            board[1, 1] = new Piece(PieceType.Piece, Color.Black);
            board[3, 3] = new Piece(PieceType.Piece, Color.Black);
            var moves = new List<Move>
            {
                new Move(Color.Red, new Location(0, 0), new Location(2, 2)),
                new Move(Color.Red, new Location(2, 2), new Location(4, 4))
            };

            Assert.AreEqual(true, board.Apply(moves));

            Assert.AreEqual(Color.Red, board[4, 4]?.Color);
            Assert.IsNull(board[1, 1]);
            Assert.IsNull(board[3, 3]);
        }

        [Test]
        public void ApplyMany_DoesNotAllowNonCaptureMoves()
        {
            var board = GetEmptyBoard(Color.Red);
            board[0, 0] = new Piece(PieceType.Piece, Color.Red);
            board[1, 1] = new Piece(PieceType.Piece, Color.Black);
            var moves = new List<Move>
            {
                new Move(Color.Red, new Location(0, 0), new Location(2, 2)),
                new Move(Color.Red, new Location(2, 2), new Location(3, 3))
            };

            Assert.AreEqual(false, board.Apply(moves));
        }

        [Test]
        public void ApplyMany_ResetsStateOnFailure()
        {
            var board = GetEmptyBoard(Color.Red);
            board[0, 0] = new Piece(PieceType.Piece, Color.Red);
            board[1, 1] = new Piece(PieceType.Piece, Color.Black);
            var moves = new List<Move>
            {
                new Move(Color.Red, new Location(0, 0), new Location(2, 2)),
                new Move(Color.Red, new Location(2, 2), new Location(3, 3))
            };

            board.Apply(moves);

            Assert.AreEqual(Color.Red, board[0, 0]?.Color);
            Assert.AreEqual(Color.Black, board[1, 1]?.Color);
            Assert.IsNull(board[2, 2]);
        }

        [Test]
        public void ApplyMany_DoesNotAllowNonChainedMoves()
        {
            var board = GetEmptyBoard(Color.Red);
            board[0, 0] = new Piece(PieceType.Piece, Color.Red);
            board[4, 0] = new Piece(PieceType.Piece, Color.Red);
            board[1, 1] = new Piece(PieceType.Piece, Color.Black);
            board[5, 1] = new Piece(PieceType.Piece, Color.Black);
            var moves = new List<Move>
            {
                new Move(Color.Red, new Location(0, 0), new Location(2, 2)),
                new Move(Color.Red, new Location(4, 0), new Location(6, 2))
            };

            Assert.AreEqual(false, board.Apply(moves));
        }

        private Board GetEmptyBoard(Color color)
        {
            var board = new Board();
            board.ResetGame(color);
            board.Clear();
            return board;
        }
    }
}
