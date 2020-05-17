import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static BASE_URL = 'http://localhost:3000';
  serverResponses = this.socket.fromEvent<any>('reply_channel');
  gameCreated = this.socket.fromEvent<any>('game_created');

  constructor(private socket: Socket,
              private http: HttpClient) { }

  joinGame(gameCode: string) {
    this.socket.emit('join_game', {gameCode});
  }

  createGame() {
    return this.http.post(ApiService.BASE_URL + '/createGame', {});
  }
}
