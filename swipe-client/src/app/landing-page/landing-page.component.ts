import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  public serverCodeForm: FormGroup;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    this.serverCodeForm = new FormGroup({
      code: new FormControl()
    });
  }

  newGame() {
    this.apiService.createGame().subscribe((response: any) => {
      this.router.navigate(['./joinGame/' + response.gameCode]);
    });
  }

  joinGame() {
    const gameCode = this.serverCodeForm.value.code;
    this.router.navigate(['./joinGame/' + gameCode]);
  }




}
