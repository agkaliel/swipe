"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var TestClass_1 = require("./lib/TestClass");
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('chat message', function (msg) {
        var testClass = new TestClass_1.TestClass();
        // testClass.doTheThing();
        console.log('broadcasting: ', msg);
        io.emit('chat message', msg);
    });
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});
//# sourceMappingURL=app.js.map