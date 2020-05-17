"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var SocketState_1 = require("./SocketState");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(io) {
        var _this = _super.call(this, io) || this;
        // Map of game codes to game objects
        _this.gameMap = new Map();
        // Map of user socket ids to game codes
        _this.socketGameMap = new Map();
        _this.userIds = new Set();
        _this.userSocketMap = new Map();
        _this.socketUserMap = new Map();
        return _this;
    }
    Controller.prototype.createGame = function (userId) {
        var gameCode = this.generateCode(Controller.GAME_CODE_LENGTH, new Set(this.gameMap.keys()));
        var game = new Game_1.Game(gameCode, userId);
        this.gameMap.set(game.gameCode, game);
        return game.gameCode;
    };
    Controller.prototype.getGameState = function (req) {
        var gameCode = req.params.gameCode;
        var game = this.gameMap.get(gameCode);
        if (!game) {
            throw "Invalid Game Code";
        }
        return game.getGameState();
    };
    Controller.prototype.joinGame = function (req) {
        var username = req.body.username;
        var gameCode = req.body.gameCode;
        var userId = req.body.userId;
        var game = this.gameMap.get(gameCode);
        if (!game) {
            throw "Invalid Game Code";
        }
        var user = game.addUser(userId, username);
        this.io.to(gameCode).emit('player_joined', user.toJSON());
    };
    Controller.prototype.connectToGame = function (socket, payload) {
        var userId = payload.userId;
        this.socketUserMap.set(socket.id, userId);
        this.userSocketMap.set(userId, socket.id);
        var gameCode = payload.gameCode;
        var game = this.gameMap.get(gameCode);
        if (!game) {
            throw "Invalid Game Code";
        }
        this.joinRoom(socket, gameCode);
    };
    Controller.prototype.generateUserId = function () {
        var userId = this.generateCode(Controller.USER_ID_LENGTH, this.userIds);
        this.userIds.add(userId);
        return userId;
    };
    Controller.prototype.joinRoom = function (socket, gameCode) {
        var previousGameCode = this.socketGameMap.get(socket.id);
        if (previousGameCode) {
            socket.leave(previousGameCode);
        }
        socket.join(gameCode);
        this.socketGameMap.set(socket.id, gameCode);
    };
    Controller.prototype.generateCode = function (length, existingKeys, remainingAttempts) {
        if (remainingAttempts === void 0) { remainingAttempts = 10; }
        if (remainingAttempts <= 0) {
            throw "Could not generate unique code";
        }
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (existingKeys.has(result)) {
            return this.generateCode(length, existingKeys, remainingAttempts - 1);
        }
        return result;
    };
    Controller.GAME_CODE_LENGTH = 5;
    Controller.USER_ID_LENGTH = 10;
    return Controller;
}(SocketState_1.SocketState));
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map