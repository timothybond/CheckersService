import * as signalR from "@microsoft/signalr";
export class ServiceMove {
    constructor(from, to, color) {
        this.from = from;
        this.to = to;
        this.color = color;
    }
}
class ServiceMoveContainer {
    constructor(move, gameId) {
        this.move = move;
        this.gameId = gameId;
    }
    ;
}
class ServicePass {
    constructor(gameId) {
        this.gameId = gameId;
    }
    ;
}
export class ServiceGame {
    constructor(id, whiteName, blackName, startTime, moves, currentPlayer, validMoves, activePiece, winner) {
        this.id = id;
        this.whiteName = whiteName;
        this.blackName = blackName;
        this.startTime = startTime;
        this.moves = moves;
        this.currentPlayer = currentPlayer;
        this.validMoves = validMoves;
        this.activePiece = activePiece;
        this.winner = winner;
    }
}
export class Service {
    constructor(updateFunction, errorFunction, url = "./hub") {
        this.updateFunction = updateFunction;
        this.errorFunction = errorFunction;
        this.url = url;
        this.connection = new signalR.HubConnectionBuilder().withUrl(url).build();
        this.connection.on("UpdateClient", updateFunction);
        this.connection.on("SendError", errorFunction);
        this.connection.start().catch(err => errorFunction(err));
    }
    createGame() {
        this.connection.send("StartGame").catch(err => this.errorFunction(err));
    }
    joinGame(gameId) {
        this.connection.send("JoinGame", gameId).catch(err => this.errorFunction(err));
    }
    move(move, gameId) {
        let requestBody = new ServiceMoveContainer(move, gameId);
        this.connection.send("Move", requestBody).catch(err => this.errorFunction(err));
    }
    pass(gameId) {
        let requestBody = new ServicePass(gameId);
        this.connection.send("Pass", requestBody).catch(err => this.errorFunction(err));
    }
}
