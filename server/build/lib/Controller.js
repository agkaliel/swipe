"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./User");
var Game_1 = require("./Game");
var Controller = /** @class */ (function () {
    function Controller() {
        this.userMap = {};
        this.games = [];
    }
    Controller.prototype.registerUser = function (socket) {
        var user = new User_1.User(socket.id);
        this.userMap[socket.id] = user;
    };
    Controller.prototype.deregisterUser = function (socket) {
        delete this.userMap[socket.id];
    };
    Controller.prototype.createGame = function () {
        var game = new Game_1.Game();
        this.games.push(game);
        return game.gameCode;
    };
    Controller.prototype.joinGame = function (payload) {
        console.log('payload: ', payload);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map