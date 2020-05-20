"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./User");
var Game = /** @class */ (function () {
    function Game(gameCode, hostId) {
        this.users = [];
        this.gameCode = gameCode;
        this.hostId = hostId;
    }
    Game.prototype.addUser = function (userId, username) {
        if (!this.userCanJoin(userId, username)) {
            throw "USER_CONFLICT";
        }
        var user = new User_1.User(userId, username);
        this.users.push(user);
        return user;
    };
    Game.prototype.getGameState = function () {
        return {
            users: this.users.map(function (user) { return user.toJSON(); })
        };
    };
    Game.prototype.userCanJoin = function (userId, username) {
        var canJoin = true;
        this.users.forEach(function (user) {
            if (user.userId === userId || user.username == username) {
                canJoin = false;
            }
        });
        return canJoin;
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map