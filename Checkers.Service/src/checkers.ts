const SVG_NS = 'http://www.w3.org/2000/svg';

export enum Color { Black = 0, Red = 1 }
export enum PieceType { Piece, King };

export class Piece {
    constructor(public readonly color: Color, public type: PieceType, public readonly id: string) {
    }
}

export class Move {
    constructor(public readonly fromX: number, public readonly fromY: number, public readonly toX: number, public readonly toY: number) {
    }
}

export class Board {
    pieces: Piece[];
    maxId: number;
    nextPlayer: Color;
    readonly svgRoot: HTMLElement;
    readonly boardSquare: number;

    constructor(boardSvgRoot: HTMLElement, boardSquareLength: number) {
        this.svgRoot = boardSvgRoot;
        this.maxId = 0;
        this.boardSquare = boardSquareLength;

        this.pieces = [];

        for (let i = 0; i < 64; i++) {
            this.pieces.push(null);
        }

        this.nextPlayer = Color.Red;
    }

    GetPiece(x: number, y: number) {
        return this.pieces[y * 8 + x];
    }

    SetPiece(x: number, y: number, piece: Piece) {
        this.pieces[y * 8 + x] = piece;
    }

    ResetBoard(color = Color.Red): void {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let piece = this.GetPiece(x, y);

                if (piece != null) {
                    this.DeleteSvg(piece);
                }
            }
        }

        this.pieces = [];

        for (let i = 0; i < 64; i++) {
            this.pieces.push(null);
        }

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 8; x++) {
                if ((x + y) % 2 == 0) {
                    let newPiece = new Piece(Color.Red, PieceType.Piece, this.PieceId(this.maxId++));
                    this.SetPiece(x, y, newPiece);
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.id);
                    this.maxId++;
                }
            }
        }

        for (let y = 5; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if ((x + y) % 2 == 0) {
                    let newPiece = new Piece(Color.Black, PieceType.Piece, this.PieceId(this.maxId++));
                    this.SetPiece(x, y, newPiece);
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.id);
                    this.maxId++;
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

        var subSvg = document.createElementNS(SVG_NS, "svg");
        subSvg.setAttribute("x", (this.boardSquare * x).toString());
        subSvg.setAttribute("y", (this.boardSquare * y).toString());
        subSvg.setAttribute("width", this.boardSquare.toString());
        subSvg.setAttribute("height", this.boardSquare.toString());
        subSvg.setAttribute("id", id);

        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("r", "40%");

        if (color === Color.Red) {
            newCircle.setAttribute("fill", "red");
            newCircle.setAttribute("class", "redpiece");
        } else {
            newCircle.setAttribute("fill", "black");
            newCircle.setAttribute("class", "blackpiece");
        }

        newCircle.setAttribute("cx", "50%");
        newCircle.setAttribute("cy", "50%");

        subSvg.appendChild(newCircle);
        svgRoot.appendChild(subSvg);
    }

    ApplyMove(move: Move, animate = false) {
        let piece = this.GetPiece(move.fromX, move.fromY);

        if (!piece) {
            return;
        }

        this.SetPiece(move.toX, move.toY, piece);
        this.SetPiece(move.fromX, move.fromY, null);

        if (Math.abs(move.toX - move.fromX) == 2) {
            var middleX = (move.fromX + move.toX) / 2;
            var middleY = (move.fromY + move.toY) / 2;

            let jumpedPiece = this.GetPiece(middleX, middleY);
            this.DeleteSvg(jumpedPiece);
            this.SetPiece(middleX, middleY, null);
        }

        if ((move.toY == 0 && piece.color == Color.Black) ||
            (move.toY == 7 && piece.color == Color.Red)) {
            piece.type = PieceType.King;
        }

        this.UpdateSvgPosition(piece, move.toX, move.toY);
    }

    GetSvg(piece: Piece): HTMLElement {
        return document.getElementById(piece.id);
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
            pieceSvg.setAttribute('x', `${this.boardSquare * x}`);
            pieceSvg.setAttribute('y', `${this.boardSquare * y}`);
        }

        if (piece.type == PieceType.King && pieceSvg.childElementCount == 0) {
            // TODO: Add some indicator for Kings
            //var lineVertical = 
        }
    }
}