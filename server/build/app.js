"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./lib/User");
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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('chat message', function (msg) {
        console.log('broadcasting: ', msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        controller.removeUserFromQueue(socket.id);
        console.log('disconnected');
    });
    socket.on('user registration', function (username) {
        var user = new User_1.User(socket.id, username);
        controller.addUserToQueue(user);
        io.emit('add user', {
            socketId: socket.id,
            username: user.username
        });
    });
    socket.on('test', function (payload) {
        console.log('payload: ', payload);
        io.emit('reply_channel', {
            socketId: socket.id,
            username: 'hello there'
        });
    });
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});
//# sourceMappingURL=app.js.map