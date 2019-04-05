"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var TestClass_1 = require("./lib/TestClass");
var testClass = new TestClass_1.TestClass();
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('chat message', function (msg) {
        testClass.doTheThing(socket);
        console.log('broadcasting: ', msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});
//# sourceMappingURL=app.js.map