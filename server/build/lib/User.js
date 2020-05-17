"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(userId, username) {
        this.userId = userId;
        this.username = username;
    }
    User.prototype.getShortId = function () {
        return this.userId.substr(0, User.SHORT_ID_LENGTH);
    };
    User.prototype.toJSON = function () {
        return {
            shortId: this.getShortId(),
            username: this.username
        };
    };
    User.SHORT_ID_LENGTH = 5;
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map