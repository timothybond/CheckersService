import { Color, Move, Board } from "./checkers";
import { ServiceMove, Service } from "./service";
import "./css/main.css";
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
let gameId = '';
let gameState = GameState.NoGame;
let userState = UserState.Ready;
let currentMove = 0;
let board = new Board(document.getElementById('board'), BOARD_SQUARE);
let userColor = Color.White;
let selectedPiece;
selectedPiece = null;
let validMoves = new Array();
let validMovesByPiece = new Map();
let validMoveIndicators = new Array();
let selectedPieceIndicator;
selectedPieceIndicator = null;
let service = new Service('.');
let winner;
winner = null;
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
function ShowJoinGame() {
    document.getElementById('setup').style.display = 'none';
    document.getElementById('joinGameSetup').style.display = 'inline';
}
function JoinGame() {
    userColor = Color.Black;
    gameId = document.getElementById('gameId').value;
    service.get(gameId)
        .then(function onGameJoined(game) {
        document.getElementById('joinGameSetup').style.display = 'none';
        document.getElementById('main').style.display = 'inline';
        gameState = GameState.InProgress;
        currentMove = 0;
        board.ResetBoard();
        UpdateGameState(game);
    }, function onGameJoinFailed(err) {
        document.getElementById('startGameFailure').style.display = 'inline';
        document.getElementById('startGameFailure').innerText = err;
    });
}
function StartGame() {
    document.getElementById('startGameFailure').style.display = 'none';
    service.create()
        .then(function onGameCreated(game) {
        document.getElementById('setup').style.display = 'none';
        document.getElementById('main').style.display = 'inline';
        gameState = GameState.InProgress;
        currentMove = 0;
        board.ResetBoard();
        UpdateGameState(game);
    }, function onGameCreationFailed(err) {
        document.getElementById('startGameFailure').style.display = 'inline';
        document.getElementById('startGameFailure').innerText = `Game creation failed: ${err}`;
    });
}
function UpdateGameState(game) {
    gameId = game.id;
    document.getElementById("gameIdInput").value = gameId;
    for (let i = currentMove; i < game.moves.length; i++) {
        let from = FromLocationString(game.moves[i].from);
        let to = FromLocationString(game.moves[i].to);
        let move = new Move(from[0], from[1], to[0], to[1]);
        board.ApplyMove(move); // TODO: Animate
        currentMove++;
    }
    winner = game.winner;
    if (winner) {
        document.getElementById('gameStatusIndicator').innerText =
            (game.winner == Color.White ? 'White' : 'Black') + ' Wins!';
        return;
    }
    if (game.currentPlayer == userColor) {
        userState = UserState.Ready;
        validMovesByPiece = new Map();
        for (let validMove of game.validMoves) {
            let fromStr = validMove.from;
            let toStr = validMove.to;
            let from = FromLocationString(fromStr);
            let to = FromLocationString(toStr);
            let fromIndex = from[0] + from[1] * 8;
            if (!validMovesByPiece.has(fromIndex)) {
                validMovesByPiece.set(fromIndex, new Array());
            }
            validMovesByPiece.get(fromIndex).push(to);
        }
    }
    else {
        userState = UserState.OtherPlayerMove;
        window.setTimeout(PollGame, 500);
    }
    document.getElementById("gameStatusIndicator").innerText =
        (game.currentPlayer == Color.White ? "White" : "Black") + "'s Turn";
}
function LocationString(x, y) {
    const vertical = '87654321';
    const horizontal = 'abcdefgh';
    return `${horizontal[x]}${vertical[y]}`;
}
function FromLocationString(s) {
    const vertical = '87654321';
    const horizontal = 'abcdefgh';
    let x = horizontal.indexOf(s[0]);
    let y = vertical.indexOf(s[1]);
    return [x, y];
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
    if (winner) {
        return;
    }
    let x = Math.floor(event.offsetX / BOARD_SQUARE);
    let y = Math.floor(event.offsetY / BOARD_SQUARE);
    switch (userState) {
        case UserState.OtherPlayerMove:
        case UserState.Processing:
            return;
        case UserState.Ready:
            let piece = board.GetPiece(x, y);
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
                ClearIndicators();
                userState = UserState.Processing;
                service
                    .move(new ServiceMove(LocationString(move.fromX, move.fromY), LocationString(move.toX, move.toY), userColor), gameId)
                    .then(function onMoveSuccess(game) {
                    UpdateGameState(game);
                }, function onMoveFailure(err) {
                    // TODO: Show error
                    userState = UserState.Ready;
                });
            }
        }
    }
}
function PollGame() {
    service.get(gameId)
        .then(function onGameUpdated(game) {
        UpdateGameState(game);
    });
}
function SelectPiece(x, y) {
    userState = UserState.PieceSelected;
    selectedPiece = [x, y];
    validMoves = validMovesByPiece.get(selectedPiece[1] * 8 + selectedPiece[0]);
    if (!validMoves) {
        validMoves = new Array();
    }
    let indicators = document.getElementById('indicators');
    selectedPieceIndicator = document.createElementNS(SVG_NS, "rect");
    selectedPieceIndicator.setAttribute("x", `${x * BOARD_SQUARE}`);
    selectedPieceIndicator.setAttribute("y", `${y * BOARD_SQUARE}`);
    selectedPieceIndicator.setAttribute("width", `${BOARD_SQUARE}`);
    selectedPieceIndicator.setAttribute("height", `${BOARD_SQUARE}`);
    selectedPieceIndicator.setAttribute("fill", "transparent");
    selectedPieceIndicator.setAttribute("stroke", "#8888ff");
    indicators.appendChild(selectedPieceIndicator);
    for (let [mx, my] of validMoves) {
        let validMoveIndicator = document.createElementNS(SVG_NS, "rect");
        validMoveIndicator.setAttribute("x", `${mx * BOARD_SQUARE}`);
        validMoveIndicator.setAttribute("y", `${my * BOARD_SQUARE}`);
        validMoveIndicator.setAttribute("width", `${BOARD_SQUARE}`);
        validMoveIndicator.setAttribute("height", `${BOARD_SQUARE}`);
        validMoveIndicator.setAttribute("fill", "transparent");
        validMoveIndicator.setAttribute("stroke", '#88ff88');
        indicators.appendChild(validMoveIndicator);
        validMoveIndicators.push(validMoveIndicator);
    }
}
function CopyGameId() {
    var gameIdInput = document.getElementById('gameIdInput');
    gameIdInput.disabled = false;
    gameIdInput.select();
    gameIdInput.setSelectionRange(0, 36);
    document.execCommand('copy');
    gameIdInput.setSelectionRange(0, 0);
    gameIdInput.disabled = true;
}
document.getElementById('startGameButton').addEventListener('click', StartGame);
document.getElementById('displayJoinGameButton').addEventListener('click', ShowJoinGame);
document.getElementById('joinGameButton').addEventListener('click', JoinGame);
document.getElementById('board').addEventListener('click', OnClick);
document.getElementById('copyGameIdButton').addEventListener('click', CopyGameId);
