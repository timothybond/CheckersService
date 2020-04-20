var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "./css/main.css";
var Color;
(function (Color) {
    Color[Color["Black"] = 0] = "Black";
    Color[Color["Red"] = 1] = "Red";
})(Color || (Color = {}));
var PieceType;
(function (PieceType) {
    PieceType[PieceType["Piece"] = 0] = "Piece";
    PieceType[PieceType["King"] = 1] = "King";
})(PieceType || (PieceType = {}));
;
const BOARD_SQUARE = 75;
const SVG_NS = 'http://www.w3.org/2000/svg';
var GameState;
(function (GameState) {
    GameState[GameState["NoGame"] = 0] = "NoGame";
    GameState[GameState["InProgress"] = 1] = "InProgress";
    GameState[GameState["GameOver"] = 2] = "GameOver";
})(GameState || (GameState = {}));
var UserState;
(function (UserState) {
    UserState[UserState["Ready"] = 0] = "Ready";
    UserState[UserState["Processing"] = 1] = "Processing";
    UserState[UserState["PieceSelected"] = 2] = "PieceSelected";
    UserState[UserState["OtherPlayerMove"] = 3] = "OtherPlayerMove";
})(UserState || (UserState = {}));
class Piece {
    constructor(color, type, svgId) {
        this.color = color;
        this.type = type;
        this.svgId = svgId;
    }
}
class Move {
    constructor(fromX, fromY, toX, toY) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
    }
}
class Board {
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
    ResetBoard(color = Color.Red) {
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
                }
                else {
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
                }
                else {
                    this.pieces[x][y] = null;
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
        subSvg.setAttribute("x", (BOARD_SQUARE * x).toString());
        subSvg.setAttribute("y", (BOARD_SQUARE * y).toString());
        subSvg.setAttribute("width", BOARD_SQUARE.toString());
        subSvg.setAttribute("height", BOARD_SQUARE.toString());
        subSvg.setAttribute("id", id);
        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("r", "40%");
        if (color === Color.Red) {
            newCircle.setAttribute("fill", "red");
        }
        else {
            newCircle.setAttribute("fill", "black");
        }
        newCircle.setAttribute("cx", "50%");
        newCircle.setAttribute("cy", "50%");
        subSvg.appendChild(newCircle);
        svgRoot.appendChild(subSvg);
    }
    ApplyMove(move, animate = false) {
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
        if ((move.toY == 0 && piece.color == Color.Black) ||
            (move.toY == 7 && piece.color == Color.Red)) {
            piece.type = PieceType.King;
        }
        this.UpdateSvgPosition(piece, move.toX, move.toY);
    }
    GetSvg(piece) {
        return document.getElementById(piece.svgId);
        ;
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
            pieceSvg.setAttribute('x', `${BOARD_SQUARE * x}`);
            pieceSvg.setAttribute('y', `${BOARD_SQUARE * y}`);
        }
        if (piece.type == PieceType.King && pieceSvg.childElementCount == 0) {
            // TODO: Add some indicator for Kings
            //var lineVertical = 
        }
    }
    IsOpen(x, y) {
        if (x < 0 || x > 7 || y < 0 || y > 7) {
            return false;
        }
        return this.pieces[x][y] == null;
    }
    GetValidMoves(x, y) {
        let validMoves = new Array();
        let offsets = new Array();
        if (userColor == Color.Red || this.pieces[x][y].type == PieceType.King) {
            offsets.push([1, 1], [-1, 1]);
        }
        if (userColor == Color.Black || this.pieces[x][y].type == PieceType.King) {
            offsets.push([1, -1], [-1, -1]);
        }
        for (let offset of offsets) {
            let newX = x + offset[0];
            let newY = y + offset[1];
            if (this.IsOpen(newX, newY)) {
                validMoves.push([newX, newY]);
            }
            else if (this.IsOpen(newX + offset[0], newY + offset[1])) {
                // Check if this is a piece we can jump
                let middlePiece = this.pieces[newX][newY];
                if (middlePiece != null && middlePiece.color != userColor) {
                    validMoves.push([newX + offset[0], newY + offset[1]]);
                }
            }
        }
        // TODO: Fix this
        return validMoves;
    }
}
let gameId = '';
let gameState = GameState.NoGame;
let userState = UserState.Ready;
let currentMove = 0;
let board = new Board();
let userColor = Color.Red;
let selectedPiece;
selectedPiece = null;
let validMoves = new Array();
let validMoveIndicators = new Array();
let selectedPieceIndicator;
selectedPieceIndicator = null;
function ClearIndicators() {
    while (validMoveIndicators.length > 0) {
        let vmi = validMoveIndicators.pop();
        vmi.remove();
    }
    if (selectedPieceIndicator) {
        selectedPieceIndicator.remove();
        selectedPieceIndicator = null;
    }
}
function StartGame() {
    document.getElementById('startGameFailure').style.display = 'none';
    fetch('./creategame')
        .then(function onGameCreated(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (response.ok) {
                document.getElementById('setup').style.display = 'none';
                document.getElementById('main').style.display = 'inline';
                let json = yield response.json();
                gameId = json.id;
                currentMove = 0;
                gameState = GameState.InProgress;
                userState = UserState.Ready;
                board.ResetBoard();
            }
            else {
                document.getElementById('startGameFailure').style.display = 'inline';
                document.getElementById('startGameFailure').innerText = `Game creation failed: ${response.statusText}`;
            }
        });
    }, function onGameCreationFailed(err) {
        document.getElementById('startGameFailure').style.display = 'inline';
        document.getElementById('startGameFailure').innerText = `Game creation failed: ${err}`;
    });
}
function LocationString(x, y) {
    const vertical = '87654321';
    const horizontal = 'abcdefgh';
    return `${horizontal[x]}${vertical[y]}`;
}
function IsValidMove(x, y) {
    for (let [moveX, moveY] of validMoves) {
        if (x == moveX && y == moveY) {
            return true;
        }
    }
    return false;
}
function OnClick(event) {
    let x = Math.floor(event.clientX / BOARD_SQUARE);
    let y = Math.floor(event.clientY / BOARD_SQUARE);
    switch (userState) {
        case UserState.OtherPlayerMove:
        case UserState.Processing:
            return;
        case UserState.Ready:
            let piece = board.pieces[x][y];
            if ((piece === null || piece === void 0 ? void 0 : piece.color) == userColor) {
                SelectPiece(x, y);
            }
            break;
        case UserState.PieceSelected: {
            if (!IsValidMove(x, y)) {
                selectedPiece = null;
                userState = UserState.Ready;
                ClearIndicators();
            }
            else {
                let move = new Move(selectedPiece[0], selectedPiece[1], x, y);
                userState = UserState.Processing;
                fetch('./move', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        'gameId': gameId,
                        'moves': [{
                                'from': LocationString(move.fromX, move.fromY),
                                'to': LocationString(move.toX, move.toY),
                                'color': userColor
                            }]
                    })
                }).then(function onSuccess(response) {
                    if (response.ok) {
                        board.ApplyMove(move);
                        userState = UserState.OtherPlayerMove;
                    }
                    else {
                        // TODO: Show error
                        userState = UserState.Ready;
                    }
                }, function onFailure(err) {
                    // TODO: Show error
                    userState = UserState.Ready;
                });
                // TODO: Check for multijump
                // TODO: Call moveservice
            }
        }
    }
}
function SelectPiece(x, y) {
    userState = UserState.PieceSelected;
    selectedPiece = [x, y];
    validMoves = board.GetValidMoves(x, y);
    // TODO: Add valid move indicators
}
document.getElementById('startGameButton').addEventListener('click', StartGame);
document.getElementById('board').addEventListener('click', OnClick);
