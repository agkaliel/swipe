import {User} from "./lib/User";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
import {Controller} from './lib/Controller';
var controller = new Controller(io);
// TODO: Figure out this import (typings?)
app.use(express.static(path.join(__dirname, '../../public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/gameState/:gameCode', function(req, res){
  console.log('GET /gameState/' + req.params.gameCode);
  let gameState = controller.getGameState(req)
  res.send({gameState});
});

app.post('/generateUserId', function(req, res) {
  console.log('POST /generateUserId');
  let userId = controller.generateUserId();
  res.send({userId});
});

app.post('/createGame', function(req, res) {
  console.log('POST /createGame');
  let gameCode = controller.createGame(req.body.userId);
  res.send({gameCode: gameCode});
});

app.post('/joinGame', function(req, res) {
  console.log('POST /joinGame');
  try {
    controller.joinGame(req);
    res.send({});
  } catch (err) {
    res.status(403).send();
  }

});

io.on('connection', function(socket){

  socket.on('disconnect', function() {
    // controller.deregisterUser(socket);
  });
  
  socket.on('test', function(payload) {
      io.emit('reply_channel', {
        socketId: socket.id,
        username: 'hello there'
      })
  })

  socket.on('connect_to_game', function(payload) {
    controller.connectToGame(socket, payload);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});