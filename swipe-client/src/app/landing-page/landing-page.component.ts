import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  public serverCodeForm: FormGroup;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.setupForm();
    this.subscribeToResponses();
  }

  setupForm() {
    this.serverCodeForm = new FormGroup({
      code: new FormControl()
    });
  }

  subscribeToResponses() {
    this.apiService.serverResponses.subscribe(response => {
      console.log('response: ', response);
    });
  }

  newGame() {
    console.log('clicked');
  }

  joinGame() {
    const payload = this.serverCodeForm.value;
    this.apiService.clientTest(payload);
  }




}
