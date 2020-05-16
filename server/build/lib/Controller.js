"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller() {
        this.userQueue = [];
    }
    Controller.prototype.addUserToQueue = function (user) {
        this.userQueue.push(user);
        console.log('user: ', user);
        this.userQueue.forEach(function (user) { return console.log('name: ', user.username); });
    };
    Controller.prototype.removeUserFromQueue = function (socket) {
        console.log('removing, id: ', socket.id);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map