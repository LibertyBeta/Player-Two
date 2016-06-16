import { Component } from '@angular/core';
import { Games } from '../../../collections/games';
import { Players } from '../../../collections/players';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { TopBar } from '../top/top.component';
import { MyPlate, PlayerPlate } from '../plate/plate.component';
import { MeteorComponent } from 'angular2-meteor';
import { OnActivate, Router, RouteSegment } from '@angular/router';

@Component({
  selector: 'play-page',
  templateUrl: 'imports/components/play/play.html',
  directives: [TopBar, MyPlate, PlayerPlate]
})
export class PlayPage extends MeteorComponent{
  games: Mongo.Cursor<Game>;
  game: Game = {
    name: '',
    displayNPC: false,
    dm:'',
    battle: false,
    createdAt: new Date()
  };
  player: Player = {
    name: "",
  };
  playerLoaded: boolean  = false;
  otherPlayers: Mongo.Cursor<Player>;
  gameTitle: string;
  gameCode: string;
  dmWarn: boolean = false;
  playerForm: any =  {
    name: '',
    currentHealth: '',
    maxHealth: '',
    game: ''
  };
  constructor (segments: RouteSegment) {
    super()
    this.playerForm.game = segments.getParam('id');

    console.log("Startin up");
    this.subscribe('game',  segments.getParam('id'), () => {
      this.game = Games.findOne();
      this.games = Games.find();
      console.log(this.game);
    }, true);
    let limiters  = {
      game: segments.getParam('id')
    };
    let singlePlayerLimiter = {
      game: segments.getParam('id'),
      owner: Meteor.userId()
    }
    let otherPlayerLimiter = {
      game: segments.getParam('id'),
      owner: {$ne: Meteor.userId()}
    }


      // this.autorun(() => {
      this.subscribe('playerRecords',  limiters, () => {
        console.log("Subbing for Players");
        let component = this;
        this.autorun(() => {
          console.log('AUTORUNNING');

          if(Players.find(singlePlayerLimiter).count() > 0){
            this.player = Players.findOne(singlePlayerLimiter);
            this.playerLoaded = true;
          } else {
            this.player = {
              name:''
            };
            this.playerLoaded = false;
          }
        },   true);



        this.otherPlayers = Players.find(otherPlayerLimiter);

      });



    // this.game = {};
    console.log("Building play");
  }

  joinGame() {
    this.call('addPlayer', this.playerForm, function(err, result){
      if(err){
        console.error(err);
      } else {
        console.log(result);
      }
    });
  }

  get gameName(): string {
    if(this.game){
      return this.game.name
    } else {
      return 'Loading...';
    }
  }

  playerDoc(): Player {
    console.log(this.player);
    if(this.player){
      return this.player
    } else {
      return {};
    }
  }

  get playerCount(): number {
    if(this.otherPlayers){
      // console.log()
      return this.otherPlayers.count();
    } else {
      return 0;
    }
  }

  get battle(): Boolean {
    if(this.game){
      return this.game.battle;
    } else {
      return false;
    }
  }

  get noInit(): Boolean {
    return false;
  }
}
