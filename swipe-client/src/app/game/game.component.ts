import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api-service.service';
import { User } from '../models/User';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameCode: string;
  users: User[] = [];

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit(): void {
    this.subscribeToGameId();
    this.subscribeToPlayersJoining();
  }

  subscribeToGameId() {
    this.route.params.subscribe(params => {
      this.gameCode = params.gameCode;
      this.loadGameState();
    });
  }

  subscribeToPlayersJoining() {
    this.apiService.playerJoined.subscribe(newPlayer => {
      this.users.push(new User(newPlayer))
    });
  }

  loadGameState() {
    this.apiService.getGameState(this.gameCode).subscribe((response: any) => {
      console.log('resposne: ', response);
      response.gameState.users.forEach(user => this.users.push(new User(user)));
      this.connectToGame();
    });
  }

  connectToGame() {
    this.apiService.connectToGame(this.gameCode);
  }

}
