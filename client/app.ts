import 'reflect-metadata';
import { Component } from '@angular/core';
import { HomePage } from '../imports/components/home/home.component';
import { PlayPage } from '../imports/components/play/play.component';
import { IndexPage } from '../imports/components/index/index.component';
import { Login, Register } from '../imports/components/account/account.component';
import { Routes, Router, ROUTER_PROVIDERS, ROUTER_DIRECTIVES } from '@angular/router';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/home', component: HomePage},
  {path: '/play/:id', component: PlayPage},
  {path: '', component: IndexPage},
  {path: '*', component: IndexPage},
//   // {path: '/hero/:id',      component: HeroDetailComponent}
])
class PlayerTwo extends MeteorComponent{
  constructor(private router: Router) {
    super();
  }
}

bootstrap(PlayerTwo, [ROUTER_PROVIDERS]);
