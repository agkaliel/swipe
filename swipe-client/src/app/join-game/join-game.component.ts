import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  gameCode: string;
  usernameForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
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
    const username = this.usernameForm.value.username;
    this.apiService.joinGame(this.gameCode, username).subscribe(response => {
      this.router.navigate(['./game/' + this.gameCode]);
    }, error => {
      this.snackBar.open('Can\'t join game', 'Dismiss', {
        duration: 2000,
      });
    });
  }
}
