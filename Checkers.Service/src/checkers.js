const SVG_NS = 'http://www.w3.org/2000/svg';
export var Color;
(function (Color) {
    Color[Color["Black"] = 0] = "Black";
    Color[Color["White"] = 1] = "White";
})(Color || (Color = {}));
export var PieceType;
(function (PieceType) {
    PieceType[PieceType["Piece"] = 0] = "Piece";
    PieceType[PieceType["King"] = 1] = "King";
})(PieceType || (PieceType = {}));
;
export class Piece {
    constructor(color, type, id) {
        this.color = color;
        this.type = type;
        this.id = id;
    }
}
export class Move {
    constructor(fromX, fromY, toX, toY) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
    }
}
export class Board {
    constructor(boardSvgRoot, boardSquareLength) {
        this.svgRoot = boardSvgRoot;
        this.maxId = 0;
        this.boardSquare = boardSquareLength;
        this.pieces = [];
        for (let i = 0; i < 64; i++) {
            this.pieces.push(null);
        }
        this.nextPlayer = Color.White;
    }
    GetPiece(x, y) {
        return this.pieces[y * 8 + x];
    }
    SetPiece(x, y, piece) {
        this.pieces[y * 8 + x] = piece;
    }
    ResetBoard(color = Color.White) {
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
                    let newPiece = new Piece(Color.White, PieceType.Piece, this.PieceId(this.maxId++));
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
    PieceId(val) {
        return `piece${val}`;
    }
    AddPieceSvg(x, y, color, id) {
        var svgRoot = document.getElementById("board");
        var subSvg = document.createElementNS(SVG_NS, "svg");
        subSvg.setAttribute("x", (this.boardSquare * x).toString());
        subSvg.setAttribute("y", (this.boardSquare * y).toString());
        subSvg.setAttribute("width", this.boardSquare.toString());
        subSvg.setAttribute("height", this.boardSquare.toString());
        subSvg.setAttribute("id", id);
        var pieceShadow = document.createElementNS(SVG_NS, "path");
        pieceShadow.setAttribute("d", "M7.5,37.5 l0,5 a1,1,0,0,0,60,0 l0,-5");
        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("r", "40%");
        if (color === Color.White) {
            newCircle.setAttribute("fill", "white");
            newCircle.setAttribute("class", "whitepiece");
            pieceShadow.setAttribute("class", "whitepieceshadow");
        }
        else {
            newCircle.setAttribute("fill", "black");
            newCircle.setAttribute("class", "blackpiece");
            pieceShadow.setAttribute("class", "blackpieceshadow");
        }
        newCircle.setAttribute("cx", "50%");
        newCircle.setAttribute("cy", "50%");
        subSvg.appendChild(pieceShadow);
        subSvg.appendChild(newCircle);
        svgRoot.appendChild(subSvg);
    }
    UpdateSvgForKing(piece) {
        let pieceSvg = this.GetSvg(piece);
        if (pieceSvg.childElementCount == 4) {
            return;
        }
        var pieceShadow = document.createElementNS(SVG_NS, "path");
        pieceShadow.setAttribute("d", "M7.5,32.5 l0,5 a1,1,0,0,0,60,0 l0,-5");
        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("r", "40%");
        if (piece.color === Color.White) {
            newCircle.setAttribute("fill", "white");
            newCircle.setAttribute("class", "whitepiece");
            pieceShadow.setAttribute("class", "whitepieceshadow");
        }
        else {
            newCircle.setAttribute("fill", "black");
            newCircle.setAttribute("class", "blackpiece");
            pieceShadow.setAttribute("class", "blackpieceshadow");
        }
        newCircle.setAttribute("cx", "50%");
        newCircle.setAttribute("cy", "32.5");
        pieceSvg.appendChild(pieceShadow);
        pieceSvg.appendChild(newCircle);
    }
    ApplyMove(move, animate = false) {
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
            (move.toY == 7 && piece.color == Color.White)) {
            piece.type = PieceType.King;
            this.UpdateSvgForKing(piece);
        }
        this.UpdateSvgPosition(piece, move.toX, move.toY);
    }
    GetSvg(piece) {
        return document.getElementById(piece.id);
    }
    DeleteSvg(piece, animate = false) {
        let pieceSvg = this.GetSvg(piece);
        if (animate) {
            // TODO: Add fade out
            window.setTimeout(pieceSvg.remove, 1000);
        }
        else {
            pieceSvg.remove();
        }
    }
    UpdateSvgPosition(piece, x, y, animate = false) {
        let pieceSvg = this.GetSvg(piece);
        if (animate) {
            // TODO: Add move animation
        }
        else {
            pieceSvg.setAttribute('x', `${this.boardSquare * x}`);
            pieceSvg.setAttribute('y', `${this.boardSquare * y}`);
        }
        if (piece.type == PieceType.King && pieceSvg.childElementCount == 0) {
            // TODO: Add some indicator for Kings
            //var lineVertical = 
        }
    }
}
