import { Component, OnInit } from '@angular/core';
import { ApiService } from './api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'swipe-client';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.generateUserId();
    }
  }

  generateUserId() {
    this.apiService.generateUserId().subscribe((response: any) => {
      localStorage.setItem('userId', response.userId);
    });
  }

}
