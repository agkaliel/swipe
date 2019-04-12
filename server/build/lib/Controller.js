"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller() {
        this.userQueue = [];
    }
    Controller.prototype.addUserToQueue = function (user) {
        this.userQueue.push(user);
        console.log('userQueue: ', this.userQueue);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map