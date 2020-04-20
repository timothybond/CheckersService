import "./css/main.css";

enum Color { Black = 0, Red = 1 }
enum PieceType { Piece, King };

const BOARD_SQUARE = 75;
const SVG_NS = 'http://www.w3.org/2000/svg';

enum GameState {
    NoGame,
    InProgress,
    GameOver
}

enum UserState {
    Ready,
    Processing,
    PieceSelected,
    OtherPlayerMove
}

class Piece {
    constructor(public readonly color: Color, public type: PieceType, public readonly svgId: string) {
    }
}

class Move {
    constructor(public readonly fromX: number, public readonly fromY: number, public readonly toX: number, public readonly toY: number) {
    }
}

class Board {
    pieces: Piece[];
    maxId: number;
    nextPlayer: Color;

    constructor() {
        this.maxId = 0;

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
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);
                    this.maxId++;
                }
            }
        }

        for (let y = 5; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if ((x + y) % 2 == 0) {
                    let newPiece = new Piece(Color.Black, PieceType.Piece, this.PieceId(this.maxId++));
                    this.SetPiece(x, y, newPiece);
                    this.AddPieceSvg(x, y, newPiece.color, newPiece.svgId);
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
        subSvg.setAttribute("x", (BOARD_SQUARE * x).toString());
        subSvg.setAttribute("y", (BOARD_SQUARE * y).toString());
        subSvg.setAttribute("width", BOARD_SQUARE.toString());
        subSvg.setAttribute("height", BOARD_SQUARE.toString());
        subSvg.setAttribute("id", id);

        var newCircle = document.createElementNS(SVG_NS, "circle");
        newCircle.setAttribute("r", "40%");

        if (color === Color.Red) {
            newCircle.setAttribute("fill", "red");
        } else {
            newCircle.setAttribute("fill", "black");
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
            pieceSvg.setAttribute('x', `${BOARD_SQUARE * x}`);
            pieceSvg.setAttribute('y', `${BOARD_SQUARE * y}`);
        }

        if (piece.type == PieceType.King && pieceSvg.childElementCount == 0) {
            // TODO: Add some indicator for Kings
            //var lineVertical = 
        }
    }
}

let gameId = '';
let gameState = GameState.NoGame;
let userState = UserState.Ready;
let currentMove = 0;
let board = new Board();
let userColor = Color.Red;
let selectedPiece: [number, number];
selectedPiece = null;
let validMoves = new Array<[number, number]>();
let validMovesByPiece = new Map<number, Array<[number, number]>>();
let validMoveIndicators = new Array<HTMLElement>();
let selectedPieceIndicator: HTMLElement;
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
        .then(
            async function onGameCreated(response) {
                if (response.ok) {
                    document.getElementById('setup').style.display = 'none';
                    document.getElementById('main').style.display = 'inline';

                    let json = await response.json();

                    gameState = GameState.InProgress;
                    currentMove = 0;
                    board.ResetBoard();

                    UpdateGameState(json);
                    
                } else {
                    document.getElementById('startGameFailure').style.display = 'inline';
                    document.getElementById('startGameFailure').innerText = `Game creation failed: ${response.statusText}`;
                }

            },
            function onGameCreationFailed(err) {
                document.getElementById('startGameFailure').style.display = 'inline';
                document.getElementById('startGameFailure').innerText = `Game creation failed: ${err}`;
            });
}

function UpdateGameState(json: any) {
    gameId = json.id;

    if (json.currentPlayer == userColor) {
        userState = UserState.Ready;
        validMovesByPiece = new Map<number, Array<[number, number]>>();

        for (let validMove of json.validMoves) {
            let fromStr = validMove.from as string;
            let toStr = validMove.to as string;

            let from = FromLocationString(fromStr);
            let to = FromLocationString(toStr);
            let fromIndex = from[0] + from[1] * 8;

            if (!validMovesByPiece.has(fromIndex)) {
                validMovesByPiece.set(fromIndex, new Array<[number, number]>());
            }

            validMovesByPiece.get(fromIndex).push(to);
        }
    } else {
        userState = UserState.OtherPlayerMove;
    }
}

function LocationString(x: number, y: number): string {
    const vertical = '87654321';
    const horizontal = 'abcdefgh';

    return `${horizontal[x]}${vertical[y]}`;
}

function FromLocationString(s: string): [number, number] {
    const vertical = '87654321';
    const horizontal = 'abcdefgh';

    let x = horizontal.indexOf(s[0]);
    let y = vertical.indexOf(s[1]);

    return [x, y];
}

function IsValidMove(x: number, y: number): boolean {
    for (let [moveX, moveY] of validMoves) {
        if (x == moveX && y == moveY) {
            return true;
        }
    }

    return false;
}

function OnClick(event : MouseEvent) {
    let x = Math.floor(event.clientX / BOARD_SQUARE);
    let y = Math.floor(event.clientY / BOARD_SQUARE);

    switch (userState) {
        case UserState.OtherPlayerMove:
        case UserState.Processing:
            return;
        case UserState.Ready:
            let piece = board.GetPiece(x, y);
            if (piece?.color == userColor) {
                SelectPiece(x, y);
            }
            break;
        case UserState.PieceSelected: {
            if (!IsValidMove(x, y)) {
                selectedPiece = null;
                userState = UserState.Ready;
                ClearIndicators();
            } else {
                let move = new Move(selectedPiece[0], selectedPiece[1], x, y);
                userState = UserState.Processing;
                fetch(
                    './move',
                    {
                        method: 'post',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            'gameId': gameId,
                            'move': {
                                'from': LocationString(move.fromX, move.fromY),
                                'to': LocationString(move.toX, move.toY),
                                'color': userColor
                            }
                        })
                    }).then(
                        function onSuccess(response) {
                            if (response.ok) {
                                board.ApplyMove(move);
                                userState = UserState.OtherPlayerMove;
                            } else {
                                // TODO: Show error
                                userState = UserState.Ready;
                            }
                        },
                        function onFailure(err) {
                            // TODO: Show error
                            userState = UserState.Ready;
                        });

                // TODO: Check for multijump
                // TODO: Call moveservice
            }
        }
    }
}

function SelectPiece(x : number, y : number) {
    userState = UserState.PieceSelected;
    selectedPiece = [x, y];
    validMoves = validMovesByPiece.get(selectedPiece[1] * 8 + selectedPiece[0]);

    if (!validMoves) {
        validMoves = new Array<[number, number]>();
    }

    // TODO: Add valid move indicators
}

document.getElementById('startGameButton').addEventListener('click', StartGame);
document.getElementById('board').addEventListener('click', OnClick);