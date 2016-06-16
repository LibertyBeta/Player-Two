import { Component } from '@angular/core';
import { Games } from '../../../collections/games';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { TopBar } from '../top/top.component';
import { MeteorComponent } from 'angular2-meteor';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: 'imports/components/home/home.html',
  directives: [TopBar, ROUTER_DIRECTIVES]
})
export class HomePage extends MeteorComponent{
  games: Mongo.Cursor<Game>;
  gameTitle: string;
  gameCode: string;
  constructor () {
    super()

    this.autorun(() => {
      console.log("Startin up");
      this.subscribe('games',  () => {
        this.games = Games.find();

      }, true);
    });
    this.gameTitle = "";
    this.gameCode = "";
  }

  createForm () {
    let newDocument = {gameName: this.gameTitle};
    console.log(newDocument);
    Meteor.call("addGame",newDocument, function(error, result){
			if(error){
				console.error("ERROR");
			} else {
				console.log(result);
				// promise fulfilled

			}
		});
  }

  jointForm () {
    Meteor.call("joinGame",this.gameCode, function(error, result){
			if(error){
				console.error(error);
			} else {
				console.log(result);
				// $location.path("/play/"+data).replace();
				// $scope.$apply();
			}
		})
  }

  get hasGames(): boolean {
    if(this.games && this.games.count() > 0){
      return true
    } else {
      return false;
    }
  }

}
