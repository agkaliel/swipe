"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var Controller_1 = require("./lib/Controller");
var controller = new Controller_1.Controller(io);
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/gameState/:gameCode', function (req, res) {
    console.log('GET /gameState/' + req.params.gameCode);
    var gameState = controller.getGameState(req);
    res.send({ gameState: gameState });
});
app.post('/generateUserId', function (req, res) {
    console.log('POST /generateUserId');
    var userId = controller.generateUserId();
    res.send({ userId: userId });
});
app.post('/createGame', function (req, res) {
    console.log('POST /createGame');
    var gameCode = controller.createGame(req.body.userId);
    res.send({ gameCode: gameCode });
});
app.post('/joinGame', function (req, res) {
    console.log('POST /joinGame');
    try {
        controller.joinGame(req);
        res.send({});
    }
    catch (err) {
        res.status(403).send();
    }
});
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        // controller.deregisterUser(socket);
    });
    socket.on('test', function (payload) {
        io.emit('reply_channel', {
            socketId: socket.id,
            username: 'hello there'
        });
    });
    socket.on('connect_to_game', function (payload) {
        controller.connectToGame(socket, payload);
    });
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});
//# sourceMappingURL=app.js.map