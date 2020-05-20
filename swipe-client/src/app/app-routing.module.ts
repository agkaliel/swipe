import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinGameComponent } from './join-game/join-game.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GameComponent } from './game/game.component';


const appRoutes: Routes = [
  {
    path: 'joinGame/:gameCode',
    component: JoinGameComponent,
  },
  {
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'game/:gameCode',
    component: GameComponent,
  },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
