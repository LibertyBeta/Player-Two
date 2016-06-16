import {Players} from './players.ts';
import {GMs} from './gamemasters.ts';
import {Games} from './games.ts';
// import {Email} from 'meteor/email';
// import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
// import {Mongo} from 'meteor/mongo';

type preGame = {
  gameName: string,
}

Meteor.methods({
  addGame: function (element: preGame) {
    let promise = Games.insert({
      name: element.gameName,
      inviteCode : '',
      createdAt: new Date(),
      users: [this.userId],
      battle: false,
      dm: '',
      displayNPC: true,
    });
    let aGame = Games.findOne({_id: promise});
    // Games.update({_id:promise}, { $set:{inviteCode: aGame._id.substring(0,4) + aGame.name.substring(0,4).replace(" ", "_")}});
    return promise;
  },

  generateInviteCode : function(gameId: string){
    var aGame = Games.findOne({_id: gameId});
    Games.update({_id:gameId}, { $set:{inviteCode: aGame._id.substring(0,4) + aGame.name.substring(0,4).replace(" ", "_")}});
    var promise = Games.findOne({_id: gameId});
    return promise;
  },

  joinGame : function(joinCode: string){
    var aGame = Games.findOne({inviteCode: joinCode});
    console.log("user ID "+this.userId);
    console.log(aGame);
    if(aGame == null) throw new Meteor.Error(404, 'Error 404: Game Not Found', 'There is no game with this invite code. ');
    else {
      Games.update({_id:aGame._id}, { $addToSet:{users: this.userId}});
      return aGame._id;
    }
  },

  addPlayer: function (element: any) {
    console.log(element);
    var promise = Players.insert({
      name: element.name,
      currentHealth: element.currentHealth,
      maxHealth: element.maxHealth,
      game: element.game,
      recovery: element.recovery,
      tempHealth: {},
      battle: {},
      conditions: [],
      owner: this.userId,
      createdAt: new Date()
    });
    if(this.userId){

      Games.update({_id:element.game}, { $addToSet:{users: this.userId}});
    }
    return promise;
  },

  addNPC: function (element: any, gameId: string) {
    console.log(element);
    var promise = Players.insert({
      name: element.name,
      currentHealth: element.health,
      maxHealth: element.health,
      game: gameId,
      tempHealth: {},
      battle: element.battle,
      conditions: [],
      owner: this.userId,
      npc: true,
      createdAt: new Date()
    });
    return promise;
  },

  removePlayer: function (element) {
    console.log(element);
    console.log("User id is" + this.userId);
    var gameId = Players.findOne({_id:element, owner:this.userId}).game;
    var promise = Players.remove({_id:element, owner:this.userId});

    if(promise === 0 && this.userId === null){
      throw new Meteor.Error(404,"Player Owner conflict");
    } else if(promise === 0 && this.userId !== null){
      throw new Meteor.Error(500,"Player Owner conflict");
    }
    if(this.userId){
      var updateUsers = Games.findOne({_id: gameId}).users;
      var index = updateUsers.indexOf(this.userId);
      if(index > -1){
        updateUsers.splice(index, 1);
      }
      Games.update({_id:gameId}, { $set:{users: updateUsers}});
    }

    return promise;
  },

  removeNPC: function(id){
    return Players.remove({_id:id, owner:this.userId});
  },

  startBattle: function(id) {
    console.log("GAME " + id + " IS ENTERING COMBAT");
    return Games.update({_id:id}, { $set:{battle: true}});
  },

  endBattle : function(id){
    console.log("ending fight: " + id);
    Games.update({_id:id}, { $set:{battle: false}});
    var result = Players.update({game:id}, { $set:{battle:{}}}, {multi: true});
    console.log(result);
  },

  pushCondition : function(conditionObject, playerId){
    console.log(conditionObject);
    console.log("Player Id for Push is " + playerId);
    console.log("+++++++++++++++++++++++++");
      Players.update({_id:playerId},{$addToSet: {conditions: conditionObject}});
      return true;
  },

  popCondition : function(conditionObject, playerId){

    Players.update({_id:playerId},{$pull:{conditions: conditionObject}});
  },

  increaseHealth : function(id, amount){
    var playerDocument = Players.findOne(id);
    if(!!Object.keys(playerDocument.tempHealth).length){
      var health = Math.min(playerDocument.tempHealth.maxHealth,playerDocument.tempHealth.currentHealth + amount);
      Players.update(
        {_id:id},
        {$set:
          {"tempHealth.currentHealth":health}
        });

    } else {
      var health = Math.min(playerDocument.maxHealth,playerDocument.currentHealth + amount);
      Players.update({_id:id}, {$set:{currentHealth:health}});
    }
  },

  decreaseHealth : function(id, amount){
    var playerDocument = Players.findOne(id);
    console.log(playerDocument);
    if(Object.keys(playerDocument.tempHealth).length !== 0){
      if(0 >= ( playerDocument.tempHealth.currentHealth - amount)){
        Players.update({_id:id}, {$set:{tempHealth:{}}});
      } else {
        // var health = Math.max(0, (playerDocument.currentHealth - amount));
        Players.update(
          {_id:id},
          {$inc: {"tempHealth.currentHealth":-amount}}
          );

      }
    } else {
      var health = Math.max(0, (playerDocument.currentHealth - amount));
      console.log("UPDAING HEALTH TO " + health);
      Players.update(
        {_id:id},
        {$set:
          {currentHealth:health}
        });
      // $scope.playerRecord.currentHealth = Math.max(0, ($scope.playerRecord.currentHealth - amount));
    }
  },

  setTempHealth : function(id, object){
    Players.update(
      {_id:id},
      {$set:
        {tempHealth:object}
      }
    );
  },

  setInit : function(id, roll){
    Players.update(
      {_id:id},
      {$set:
        {battle:roll}
      }
    );
  },

  endRound : function(id){
    Players.update(
      {_id:id},
      {$inc:
        {"battle.round":1}
      }
    );
  },

  advanceRound : function(id, round){
    Players.update(
      {gameId:id, "battle.round": {$lt:round}},
      {$inc:
        {"battle.round":1}
      }
    );
  },

  changeGameDM : function(userId, gameId){
    //first, check to see if there is already a dm. No overwriting the dm. EVER.
    var dmCheck  = Games.findOne(gameId);
    if(dmCheck.dm){
      throw new Meteor.Error(503,"DM already exists");
    } else {
      Games.update({_id:gameId}, {$set:{dm:userId}});
      return gameId;
    }
  },

  dmCheck : function(gameId){
    console.log("Checking for game " + gameId);
    var dmCheck  = Games.findOne({_id:gameId, dm:Meteor.userId()});
    console.log(dmCheck);
    // return false;
    if(dmCheck) return true;
    return false;
  },

  toggleNPC : function(gameId){
    var game = Games.findOne({_id:gameId, dm:Meteor.userId()});
    // if(game.displayNPC == 1) return Games.update({_id:gameId, dm:Meteor.userId()}, {$set:{displayNPC:0}})
    // else return Games.update({_id:gameId, dm:Meteor.userId()}, {$set:{displayNPC:1}})
  }

});