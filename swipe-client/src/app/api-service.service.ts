import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverResponses = this.socket.fromEvent<any>('reply_channel');

  constructor(private socket: Socket) { }

  clientTest(payload) {
    this.socket.emit('test', 'hi...');
  }
}
