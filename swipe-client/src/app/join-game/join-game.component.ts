import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  gameCode: string;
  usernameForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit(): void {
    this.subscribeToGameId();
    this.setupForm();
  }

  subscribeToGameId() {
    this.route.params.subscribe(params => {
      this.gameCode = params.gameCode;
    });
  }

  setupForm() {
    this.usernameForm = new FormGroup({
      username: new FormControl()
    });
  }

  joinGame() {
    this.apiService.joinGame(this.gameCode);
  }

}
