"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestClass = /** @class */ (function () {
    function TestClass() {
    }
    TestClass.prototype.doTheThing = function (socket) {
        console.log('socket id: ', socket.id);
        console.log('works');
    };
    return TestClass;
}());
exports.TestClass = TestClass;
//# sourceMappingURL=TestClass.js.map