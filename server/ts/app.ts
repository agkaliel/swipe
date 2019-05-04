import {User} from "./lib/User";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
import {Controller} from './lib/Controller';
var controller = new Controller();
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    console.log('broadcasting: ', msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    controller.removeUserFromQueue(socket.id);
    console.log('disconnected');
  });

  socket.on('user registration', function(username: string) {
      let user = new User(socket.id, username);
      controller.addUserToQueue(user);
      io.emit('add user', {
        socketId: socket.id,
        username: user.username
      });
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});