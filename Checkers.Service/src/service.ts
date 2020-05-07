import { Color } from "./checkers";
import * as signalR from "@microsoft/signalr";

export class ServiceMove {
    constructor(public readonly from: string, public readonly to: string, public readonly color: Color) {
    }
}

class ServiceMoveContainer {
    constructor(public readonly move: ServiceMove, public readonly gameId: string) { };
}

class ServicePass {
    constructor(public readonly gameId: string) { };
}

export class ServiceGame {
    constructor(
        public readonly id: string,
        public readonly whiteName: string,
        public readonly blackName: string,
        public readonly startTime: Date,
        public readonly moves: Array<ServiceMove | null>,
        public readonly currentPlayer: Color,
        public readonly validMoves: Array<ServiceMove>,
        public readonly activePiece: string,
        public readonly winner?: Color) {
    }
}

export interface UpdateFunction {
    (game: ServiceGame): void;
}

export interface ErrorFunction {
    (error: string): void;
}

export class Service {
    connection: signalR.HubConnection;

    constructor(private updateFunction: UpdateFunction, private errorFunction: ErrorFunction, public readonly url = "./hub") {
        this.connection = new signalR.HubConnectionBuilder().withUrl(url).build();

        this.connection.on("UpdateClient", updateFunction);
        this.connection.on("SendError", errorFunction);

        this.connection.start().catch(err => errorFunction(err));
    }

    createGame() {
        this.connection.send("StartGame").catch(err => this.errorFunction(err));
    }

    joinGame(gameId: string) {
        this.connection.send("JoinGame", gameId).catch(err => this.errorFunction(err));
    }

    move(move: ServiceMove, gameId: string) {
        let requestBody = new ServiceMoveContainer(move, gameId);

        this.connection.send("Move", requestBody).catch(err => this.errorFunction(err));
    }

    pass(gameId: string) {
        let requestBody = new ServicePass(gameId);

        this.connection.send("Pass", requestBody).catch(err => this.errorFunction(err));
    }
}