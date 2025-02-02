﻿import { Color, Piece, Move, Board } from "./checkers";
import { ServiceMove, ServiceGame, Service } from "./service";
import "./css/main.css";

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

let gameId = '';
let gameState = GameState.NoGame;
let userState = UserState.Ready;
let currentMove = 0;
let board = new Board(document.getElementById('board'), BOARD_SQUARE);
let userColor = Color.White;
let selectedPiece: [number, number];
selectedPiece = null;
let validMoves = new Array<[number, number]>();
let validMovesByPiece = new Map<number, Array<[number, number]>>();
let validMoveIndicators = new Array<SVGRectElement>();
let selectedPieceIndicator: SVGRectElement;
selectedPieceIndicator = null;
let service = new Service(UpdateGameState, ShowError);
let winner: Color;
winner = null;

function ShowError(err: string) {
    console.error(err);
}

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

    gameId = (<HTMLInputElement>document.getElementById('gameId')).value;

    document.getElementById('startGameFailure').style.display = 'none';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('joinGameSetup').style.display = 'none';

    board.ResetBoard();

    service.joinGame(gameId);
}

function StartGame() {
    document.getElementById('startGameFailure').style.display = 'none';
    document.getElementById('setup').style.display = 'none';

    board.ResetBoard();

    service.createGame();
}

function UpdateGameState(game: ServiceGame) : void {
    gameId = game.id;

    (<HTMLInputElement>document.getElementById("gameIdInput")).value = gameId;

    for (let i = currentMove; i < game.moves.length; i++) {
        if (game.moves[i]) {
            let from = FromLocationString(game.moves[i].from);
            let to = FromLocationString(game.moves[i].to);

            let move = new Move(from[0], from[1], to[0], to[1]);
            board.ApplyMove(move); // TODO: Animate
        }

        currentMove++;
    }

    winner = game.winner;

    if (winner) {
        document.getElementById('gameStatusIndicator').innerText = 
            (game.winner == Color.White ? 'White' : 'Black') + ' Wins!'
        return;
    }

    if (game.currentPlayer == userColor) {
        userState = UserState.Ready;
        validMovesByPiece = new Map<number, Array<[number, number]>>();

        for (let validMove of game.validMoves) {
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

    document.getElementById("passButtonContainer").style.visibility = (game.activePiece) ? "visible" : "hidden";

    document.getElementById("main").style.display = "inline";

    document.getElementById("gameStatusIndicator").innerText =
        (game.currentPlayer == Color.White ? "White" : "Black") + "'s Turn";
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

function Pass() {
    service.pass(gameId);
}

function OnClick(event: MouseEvent) {
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
                ClearIndicators();
                userState = UserState.Processing;
                service
                    .move(
                        new ServiceMove(
                            LocationString(move.fromX, move.fromY),
                            LocationString(move.toX, move.toY),
                            userColor),
                        gameId);
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
    var gameIdInput = document.getElementById('gameIdInput') as HTMLInputElement;

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
document.getElementById('passButton').addEventListener('click', Pass);