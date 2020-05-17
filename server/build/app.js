"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var Controller_1 = require("./lib/Controller");
var controller = new Controller_1.Controller();
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.post('/createGame', function (req, res) {
    var gameCode = controller.createGame();
    res.send({ gameCode: gameCode });
});
io.on('connection', function (socket) {
    controller.registerUser(socket);
    socket.on('disconnect', function () {
        controller.deregisterUser(socket);
    });
    socket.on('test', function (payload) {
        console.log('payload: ', payload);
        io.emit('reply_channel', {
            socketId: socket.id,
            username: 'hello there'
        });
    });
    socket.on('join_game', function (payload) {
        controller.joinGame(payload);
    });
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});
//# sourceMappingURL=app.js.map