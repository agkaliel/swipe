import {Game} from "./Game";
import { SocketState } from "./SocketState";

export class Controller extends SocketState {
    static CODE_LENGTH = 5;
    private gameMap: Map<string, Game>;

    constructor(io) {
        super(io);
    }    

    createGame(): string {
        let game = new Game(this.generateCode(Controller.CODE_LENGTH));
        this.gameMap.set(game.gameCode, game);
        return game.gameCode;
    }

    joinGame(socket, payload) {
        let gameCode = payload.gameCode;
        let game = this.gameMap.get(gameCode)
    }

    generateCode(length: number, remainingAttempts: number = 10): string {
        if (remainingAttempts <= 0) {
            throw "Could not generate unique code";
        }

        let result  = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        if (this.gameMap.has(result)) {
            return this.generateCode(Controller.CODE_LENGTH, remainingAttempts - 1);
        }

        return result;
    }
} 