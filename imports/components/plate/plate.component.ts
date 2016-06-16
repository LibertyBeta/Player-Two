import { Component, Input } from '@angular/core';
import { Players } from '../../../collections/players';
import { HpBar } from "../bar/bar.component";
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'default-plate',
  templateUrl: 'imports/components/plate/default.html'
})
export class BasePlate {
  @Input() player: Player;

  tempInput:number;
  dmgInput:number;
  constructor() {
    console.log(this.player);

  }

  addHealth(){
    console.log(this.dmgInput);
    Meteor.call("increaseHealth", this.player._id, this.dmgInput);
    this.dmgInput = '';
  }

  removeHealth(amount:number){
    console.log(this.dmgInput);
    Meteor.call("decreaseHealth", this.player._id, this.dmgInput);
    this.dmgInput = '';
  }

  addCondition(){

  }

  kill(){
    Meteor.call("decreaseHealth", this.player._id, this.player.currentHealth);
  }

  remove(){

  }

  setTempHealth(){

  }

  setInit(value:number){

  }

  getHealthPrecent(){

  }

  getHealthClass(){

  }
}


@Component({
  selector: 'my-plate',
  templateUrl: 'imports/components/plate/player.html',
  directives: [HpBar]
})
export class MyPlate extends BasePlate{
  @Input() player: Player;

}

@Component({
  selector: 'player-plate',
  templateUrl: 'imports/components/plate/party.html',
  directives: [HpBar]
})
export class PlayerPlate extends BasePlate{
  @Input() player: Player;

}

@Component({
  selector: 'dm-plate',
  templateUrl: 'imports/components/plate/dm.html',
  directives: [HpBar]
})
export class DmPlate extends BasePlate{
  @Input() player: Player;

}
