import {Game} from "./Game";
import { SocketState } from "./SocketState";

export class Controller extends SocketState {
    static GAME_CODE_LENGTH = 5;
    static USER_ID_LENGTH = 10;
    // Map of game codes to game objects
    private gameMap: Map<string, Game> = new Map();

    // Map of user socket ids to game codes
    private socketGameMap: Map<string, string> = new Map();

    private userIds: Set<string> = new Set();
    private userSocketMap: Map<string, string> = new Map();
    private socketUserMap: Map<string, string> = new Map();

    constructor(io) {
        super(io);
    }    

    createGame(userId: string): string {
        let gameCode = this.generateCode(Controller.GAME_CODE_LENGTH, new Set(this.gameMap.keys()));
        let game = new Game(gameCode, userId);
        this.gameMap.set(game.gameCode, game);
        return game.gameCode;
    }

    getGameState(req) {
        let gameCode = req.params.gameCode;
        let game = this.gameMap.get(gameCode);
        if (!game) {
            throw "Invalid Game Code";
        }
        return game.getGameState();
    }

    joinGame(req) {
        let username = req.body.username;
        let gameCode = req.body.gameCode;
        let userId = req.body.userId
        
        let game = this.gameMap.get(gameCode);

        if (!game) {
            throw "Invalid Game Code";
        }

        let user = game.addUser(userId, username);
        this.io.to(gameCode).emit('player_joined', user.toJSON());
    }

    connectToGame(socket, payload) {
        const userId = payload.userId;
        this.socketUserMap.set(socket.id, userId);
        this.userSocketMap.set(userId, socket.id);

        const gameCode = payload.gameCode;
        let game = this.gameMap.get(gameCode);

        if (!game) {
            throw "Invalid Game Code";
        }

        this.joinRoom(socket, gameCode);
    }

    generateUserId() {
        let userId = this.generateCode(Controller.USER_ID_LENGTH, this.userIds);
        this.userIds.add(userId);
        return userId;
    }

    private joinRoom(socket, gameCode: string) {
        let previousGameCode = this.socketGameMap.get(socket.id);
        if (previousGameCode) {
            socket.leave(previousGameCode);
        }

        socket.join(gameCode);
        this.socketGameMap.set(socket.id, gameCode);
    }

    private generateCode(length: number, existingKeys: Set<string>, remainingAttempts: number = 10): string {
        if (remainingAttempts <= 0) {
            throw "Could not generate unique code";
        }

        let result  = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
           result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        if (existingKeys.has(result)) {
            return this.generateCode(length, existingKeys, remainingAttempts - 1);
        }

        return result;
    }
} 