import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static BASE_URL = 'http://localhost:3000';
  playerJoined = this.socket.fromEvent<any>('player_joined');

  constructor(private socket: Socket,
              private http: HttpClient) {}
// TODO: Allow joining from URL link
// TODO: Allow leaving? 
// Allow 'starting' game (lock it down)
// Allow taking turns incrementing (or decrementing) a number
  joinGame(gameCode: string, username: string) {
    const userId = localStorage.getItem('userId');
    return this.http.post(ApiService.BASE_URL + '/joinGame', {gameCode, username, userId});
  }

  getGameState(gameCode: string) {
    return this.http.get(ApiService.BASE_URL + '/gameState/' + gameCode);
  }

  createGame() {
    const userId = localStorage.getItem('userId');
    return this.http.post(ApiService.BASE_URL + '/createGame', {userId});
  }

  generateUserId() {
    return this.http.post(ApiService.BASE_URL + '/generateUserId', {});
  }

  connectToGame(gameCode: string) {
    const userId = localStorage.getItem('userId');
    this.socket.emit('connect_to_game', {gameCode, userId});
  }
}
