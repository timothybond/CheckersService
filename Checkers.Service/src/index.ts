import "./css/main.css";

enum Color { Black, Red }
enum PieceType { Piece, King };

const BOARD_SQUARE = 75;
const PIECE_RADIUS = 30;
const SVG_NS = 'http://www.w3.org/2000/svg';

class Piece {
    constructor(public readonly color: Color, public type: PieceType, public readonly svgId: string) {
    }
}

class Move {
    constructor(public readonly fromX: number, public readonly fromY: number, public readonly toX: number, public readonly toY: number) {
    }
}

class Board {
    pieces: Piece[][];
    maxId: number;
    nextPlayer: Color;

    constructor() {
        this.maxId = 0;

        this.pieces = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ];

        this.nextPlayer = Color.Red;
    }

    ResetBoard(color = Color.Red): void {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let piece = this.pieces[x][y];

                if (piece != null) {
                    this.DeleteSvg(piece);
                }
            }
        }

        this.pieces = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ];

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 8; x++) {
                if ((x + y) % 2 == 0) {
                    let newPiece = new Piece(Color.Red, PieceType.Piece, this.PieceId(this.maxId++));
                    this.pieces[x][y] = newPiece;
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);
                    this.maxId++;
                } else {
                    this.pieces[x][y] = null;
                }
            }
        }

        for (let y = 5; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if ((x + y) % 2 == 0) {
                    let newPiece = new Piece(Color.Black, PieceType.Piece, this.PieceId(this.maxId++));
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);
                    this.maxId++;
                } else {
                    this.pieces[x][y] = null;
                }
            }
        }

        this.nextPlayer = color;
    }

    PieceId(val: number): string {
        return `piece${val}`;
    }

    AddPieceSvg(x: number, y: number, color: Color, id: string) {
        var svgRoot = document.getElementById("board");

        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("id", id);
        newCircle.setAttribute("r", PIECE_RADIUS.toString());

        if (color === Color.Red) {
            newCircle.setAttribute("fill", "red");
        } else {
            newCircle.setAttribute("fill", "black");
        }

        newCircle.setAttribute("cx", (BOARD_SQUARE * (x + 0.5)).toString());
        newCircle.setAttribute("cy", (BOARD_SQUARE * (y + 0.5)).toString());

        svgRoot.appendChild(newCircle);
    }

    ApplyMove(move: Move, animate = false) {
        let piece = this.pieces[move.fromX][move.fromY];

        if (!piece) {
            return;
        }

        this.pieces[move.toX][move.toY] = piece;
        this.pieces[move.fromX][move.fromY] = null;

        if (Math.abs(move.toX - move.fromX) == 2) {
            var middleX = (move.fromX + move.toX) / 2;
            var middleY = (move.fromY + move.toY) / 2;

            let jumpedPiece = this.pieces[middleX][middleY];
            this.DeleteSvg(jumpedPiece);
            this.pieces[middleX][middleY] = null;
        }

        this.UpdateSvgPosition(piece, move.toX, move.toY);
    }

    GetSvg(piece: Piece) : HTMLElement {
        return document.getElementById(piece.svgId);;
    }

    DeleteSvg(piece: Piece, animate = false) {
        let pieceSvg = this.GetSvg(piece);

        if (animate) {
            // TODO: Add fade out
            window.setTimeout(pieceSvg.remove, 1000);
        } else {
            pieceSvg.remove();
        }
    }

    UpdateSvgPosition(piece: Piece, x: number, y: number, animate = false) {
        let pieceSvg = this.GetSvg(piece);

        if (animate) {
            // TODO: Add move animation
        } else {
            pieceSvg.setAttribute('cx', `${BOARD_SQUARE * (x + 0.5)}`)
            pieceSvg.setAttribute('cy', `${BOARD_SQUARE * (y + 0.5)}`)
        }
    }
}

let board = new Board();
board.ResetBoard();
board.ApplyMove(new Move(0, 2, 1, 3));