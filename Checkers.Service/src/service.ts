import { Color } from "./checkers";

export class ServiceMove {
    constructor(public readonly from: string, public readonly to: string, public readonly color: Color) {
    }
}

class ServiceMoveContainer {
    constructor(public readonly move: ServiceMove, public readonly gameId: string) { };
}

export class ServiceGame {
    constructor(
        public readonly id: string,
        public readonly whiteName: string,
        public readonly blackName: string,
        public readonly startTime: Date,
        public readonly moves: Array<ServiceMove>,
        public readonly currentPlayer: Color,
        public readonly validMoves: Array<ServiceMove>,
        public readonly activePiece: string,
        public readonly winner?: Color) {
    }
}

export class Service {
    constructor(public readonly url = ".") { }

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

    private createOrGetGame(fullUrl: string, errorPrefix: string) : Promise<ServiceGame> {
        return fetch(fullUrl)
            .then(
                async function onGameRetrieved(response) {
                    if (response.ok) {
                        let json = await response.json();
                        let game = json as ServiceGame;
                        return game;

                    } else {
                        return Promise.reject<ServiceGame>(`${errorPrefix}: ${response.statusText}`);
                    }
                },
                function onFailure(err) {
                    return Promise.reject<ServiceGame>(`${errorPrefix}: ${err}`);
                });
    }

    get(gameId: string): Promise<ServiceGame>{
        return this.createOrGetGame(
            `${this.url}/getgame/${gameId}`,
            'Failed to retrieve game');
    }

    create(): Promise<ServiceGame> {
        return this.createOrGetGame(
            `${this.url}/creategame`,
            'Failed to create game');
    }

    move(move: ServiceMove, gameId: string): Promise<ServiceGame> {
        let requestBody = new ServiceMoveContainer(move, gameId);

        return fetch(`${this.url}/move`,
            {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            .then(
                async function onSuccess(response) {
                    if (response.ok) {
                        let json = await response.json();
                        let game = json as ServiceGame;
                        return game;

                    } else {
                        return Promise.reject<ServiceGame>(`Move failed: ${response.statusText}`);
                    }
                },
                function onFailure(err) {
                    return Promise.reject<ServiceGame>(`Move failed: ${err}`);
                })
    }
}