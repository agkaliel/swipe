import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinGameComponent } from './join-game/join-game.component';
import { LandingPageComponent } from './landing-page/landing-page.component';


const appRoutes: Routes = [
  {
    path: 'joinGame/:gameCode',
    component: JoinGameComponent,
  },
  {
    path: 'landingPage',
    component: LandingPageComponent,
  },
  { path: '',   redirectTo: '/landingPage', pathMatch: 'full' }
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
