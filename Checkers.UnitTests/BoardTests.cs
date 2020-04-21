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
        [TestCase(0, 0, Color.White)]
        [TestCase(2, 0, Color.White)]
        [TestCase(4, 0, Color.White)]
        [TestCase(6, 0, Color.White)]
        [TestCase(1, 1, Color.White)]
        [TestCase(3, 1, Color.White)]
        [TestCase(5, 1, Color.White)]
        [TestCase(7, 1, Color.White)]
        [TestCase(0, 2, Color.White)]
        [TestCase(2, 2, Color.White)]
        [TestCase(4, 2, Color.White)]
        [TestCase(6, 2, Color.White)]
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
        [TestCase(Color.White, 4, 2, 2, 4)]
        [TestCase(Color.White, 4, 2, 6, 4)]
        public void IsValid_AllowsCaptures(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            Assert.AreEqual(true, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3)]
        [TestCase(Color.Black, 3, 5, 5, 3)]
        [TestCase(Color.White, 4, 2, 2, 4)]
        [TestCase(Color.White, 4, 2, 6, 4)]
        public void IsValid_PreventsBlocked(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);
            board[to] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            Assert.AreEqual(false, board.IsValid(move));
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3, 3, 1)]
        [TestCase(Color.Black, 3, 5, 5, 3, 7, 1)]
        [TestCase(Color.White, 4, 2, 2, 4, 4, 6)]
        [TestCase(Color.White, 4, 2, 6, 4, 4, 6)]
        public void IsValid_AllowsChainedCapture(Color color, int fromX, int fromY, int toX, int toY, int finalX, int finalY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var final = new Location(finalX, finalY);
            var initalMove = new Move(color, from, to);
            var finalMove = new Move(color, to, final);
            
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);
            middle = new Location((toX + finalX) / 2, (toY + finalY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            board.Apply(initalMove);

            Assert.AreEqual(true, board.IsValid(finalMove));
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3, 2, 2)]
        [TestCase(Color.Black, 3, 5, 5, 3, 6, 2)]
        [TestCase(Color.White, 4, 2, 2, 4, 3, 5)]
        [TestCase(Color.White, 4, 2, 6, 4, 5, 5)]
        public void IsValid_DoesNotAllowChainedNonCapture(Color color, int fromX, int fromY, int toX, int toY, int finalX, int finalY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var final = new Location(finalX, finalY);
            var initalMove = new Move(color, from, to);
            var finalMove = new Move(color, to, final);

            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            board.Apply(initalMove);

            Assert.AreEqual(false, board.IsValid(finalMove));
        }

        [Test]
        [TestCase(Color.Black, 1, 5, 2, 4)]
        [TestCase(Color.Black, 1, 5, 0, 4)]
        [TestCase(Color.White, 4, 2, 3, 3)]
        [TestCase(Color.White, 4, 2, 5, 3)]
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
        [TestCase(Color.White, 4, 2, 3, 1)]
        [TestCase(Color.White, 4, 2, 5, 1)]
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
        [TestCase(Color.White, 4, 2, 3, 1)]
        [TestCase(Color.White, 4, 2, 5, 1)]
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
        [TestCase(Color.White, 4, 2, 3, 3)]
        [TestCase(Color.White, 4, 2, 5, 3)]
        [TestCase(Color.Black, 1, 5, 2, 6)]
        [TestCase(Color.Black, 1, 5, 0, 6)]
        [TestCase(Color.White, 4, 2, 3, 1)]
        [TestCase(Color.White, 4, 2, 5, 1)]
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
        [TestCase(Color.Black, 1, 5, 2, 4)]
        [TestCase(Color.Black, 1, 5, 0, 4)]
        [TestCase(Color.White, 4, 2, 3, 3)]
        [TestCase(Color.White, 4, 2, 5, 3)]
        [TestCase(Color.Black, 1, 5, 2, 6)]
        [TestCase(Color.Black, 1, 5, 0, 6)]
        [TestCase(Color.White, 4, 2, 3, 1)]
        [TestCase(Color.White, 4, 2, 5, 1)]
        public void Apply_SetsNextPlayer(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.King, color);

            board.Apply(move);

            Assert.AreNotEqual(color, board.CurrentPlayer);
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3, 3, 1)]
        [TestCase(Color.Black, 3, 5, 5, 3, 7, 1)]
        [TestCase(Color.White, 4, 2, 2, 4, 4, 6)]
        [TestCase(Color.White, 4, 2, 6, 4, 4, 6)]
        public void Apply_DoesNotSetNextPlayerAfterPossibleChainedCapture(Color color, int fromX, int fromY, int toX, int toY, int finalX, int finalY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var final = new Location(finalX, finalY);
            var initalMove = new Move(color, from, to);
            var finalMove = new Move(color, to, final);

            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);
            middle = new Location((toX + finalX) / 2, (toY + finalY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            board.Apply(initalMove);

            Assert.AreEqual(color, board.CurrentPlayer);
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3, 3, 1)]
        [TestCase(Color.Black, 3, 5, 5, 3, 7, 1)]
        [TestCase(Color.White, 4, 2, 2, 4, 4, 6)]
        [TestCase(Color.White, 4, 2, 6, 4, 4, 6)]
        public void Apply_SetsActivePieceAfterPossibleChainedCapture(Color color, int fromX, int fromY, int toX, int toY, int finalX, int finalY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var final = new Location(finalX, finalY);
            var initalMove = new Move(color, from, to);
            var finalMove = new Move(color, to, final);

            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);
            middle = new Location((toX + finalX) / 2, (toY + finalY) / 2);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            board.Apply(initalMove);

            Assert.AreEqual(to, board.ActivePiece);
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3)]
        [TestCase(Color.Black, 3, 5, 5, 3)]
        [TestCase(Color.White, 4, 2, 2, 4)]
        [TestCase(Color.White, 4, 2, 6, 4)]
        public void Apply_RemovesCapturedPiece(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            Assert.AreEqual(true, board.Apply(move));

            Assert.IsNull(board[middle]);
        }

        [Test]
        [TestCase(Color.Black, 3, 5, 1, 3)]
        [TestCase(Color.Black, 3, 5, 5, 3)]
        [TestCase(Color.White, 4, 2, 2, 4)]
        [TestCase(Color.White, 4, 2, 6, 4)]
        public void Apply_SetsNextPlayerAfterCapture(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var middle = new Location((fromX + toX) / 2, (fromY + toY) / 2);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);
            board[middle] = new Piece(PieceType.Piece, color == Color.White ? Color.Black : Color.White);

            board.Apply(move);

            Assert.AreNotEqual(color, board.CurrentPlayer);
        }

        [Test]
        [TestCase(Color.Black, 1, 1, 0, 0)]
        [TestCase(Color.Black, 5, 1, 6, 0)]
        [TestCase(Color.White, 2, 6, 1, 7)]
        [TestCase(Color.White, 6, 6, 7, 7)]
        public void Apply_KingsPieceAtFinalRow(Color color, int fromX, int fromY, int toX, int toY)
        {
            var from = new Location(fromX, fromY);
            var to = new Location(toX, toY);
            var move = new Move(color, from, to);
            var board = GetEmptyBoard(color);
            board[from] = new Piece(PieceType.Piece, color);

            Assert.AreEqual(true, board.Apply(move));

            Assert.IsNull(board[from]);
            Assert.AreEqual(PieceType.King, board[to]?.Type);
        }

        [Test]
        public void GetValidMoves_StartingBoard()
        {
            var board = new Board();
            board.ResetGame(Color.White);

            var validMoves = board.GetValidMoves();

            // Four starting pieces can move, but one is adjacent to the wall
            Assert.AreEqual(7, validMoves.Count);

            Assert.Contains(new Move(Color.White, new Location(0, 2), new Location(1, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(2, 2), new Location(1, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(2, 2), new Location(3, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(4, 2), new Location(3, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(4, 2), new Location(5, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(6, 2), new Location(5, 3)), validMoves);
            Assert.Contains(new Move(Color.White, new Location(6, 2), new Location(7, 3)), validMoves);
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
