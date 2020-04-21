var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    constructor(url = ".") {
        this.url = url;
    }
    //private async handleResponse(response: Response, errorPrefix: string) : Promise<ServiceGame>{
    //    if (response.ok) {
    //        let json = await response.json();
    //        let game = json as ServiceGame;
    //        return Promise.resolve(game);
    //    } else {
    //        return Promise.reject<ServiceGame>(`${errorPrefix}: ${response.statusText}`);
    //    }
    //}
    //private handleFailure(response: Response, errorPrefix: string) : Promise<ServiceGame>{
    //    return Promise.reject<ServiceGame>(`${errorPrefix}: ${err}`);
    //}
    createOrGetGame(fullUrl, errorPrefix) {
        return fetch(fullUrl)
            .then(function onGameRetrieved(response) {
            return __awaiter(this, void 0, void 0, function* () {
                if (response.ok) {
                    let json = yield response.json();
                    let game = json;
                    return game;
                }
                else {
                    return Promise.reject(`${errorPrefix}: ${response.statusText}`);
                }
            });
        }, function onFailure(err) {
            return Promise.reject(`${errorPrefix}: ${err}`);
        });
    }
    get(gameId) {
        return this.createOrGetGame(`${this.url}/getgame/${gameId}`, 'Failed to retrieve game');
    }
    create() {
        return this.createOrGetGame(`${this.url}/creategame`, 'Failed to create game');
    }
    move(move, gameId) {
        let requestBody = new ServiceMoveContainer(move, gameId);
        return fetch(`${this.url}/move`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(function onSuccess(response) {
            return __awaiter(this, void 0, void 0, function* () {
                if (response.ok) {
                    let json = yield response.json();
                    let game = json;
                    return game;
                }
                else {
                    return Promise.reject(`Move failed: ${response.statusText}`);
                }
            });
        }, function onFailure(err) {
            return Promise.reject(`Move failed: ${err}`);
        });
    }
}
