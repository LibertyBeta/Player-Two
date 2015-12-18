
Meteor.methods({
  addGame: function (element) {
    var promise = Games.insert({
      name: element.gameName,
      inviteCode : '',
      createdAt: new Date(),
      users: [this.userId],
      battle: false
    });
    var aGame = Games.findOne({_id: promise});
    Games.update({_id:promise}, { $set:{inviteCode: aGame._id.substring(0,4) + aGame.name.substring(0,4).replace(" ", "_")}});
    return promise;
  },

  generateInviteCode : function(gameId){
    var aGame = Games.findOne({_id: gameId});
    Games.update({_id:gameId}, { $set:{inviteCode: aGame._id.substring(0,4) + aGame.name.substring(0,4).replace(" ", "_")}});
    var promise = Games.findOne({_id: gameId});
    return promise;
  },

  joinGame : function(joinCode){
    var aGame = Games.findOne({inviteCode: joinCode});
    console.log("user ID "+this.userId);
    console.log(aGame);
    if(aGame == null) return false;
    else {
      Games.update({_id:aGame._id}, { $addToSet:{users: this.userId}});
      return aGame._id;
    }
  },

  addPlayer: function (element) {
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

  startBattle: function(id) {
    Games.update({_id:id}, { $set:{battle: true}});
  },

  endBattle : function(id){
    console.log("ending fight: " + id);
    Games.update({_id:id}, { $set:{battle: false}});
    Players.update({game:id}, { $set:{battle: {}}});
  },

  pushCondition : function(conditionObject, playerId){
    var currentConditions = Players.findOne({_id:playerId, owner:this.userId}).conditions;
    console.log(currentConditions);
    console.log("NEW CONDITION INDEX");
    console.log(currentConditions.indexOf(conditionObject));
    var fail = false;
    for(var i = 0; i < currentConditions.length; i++){
        if(currentConditions[i].name == conditionObject.name){
            fail = true;
        }
    };
    if(!fail){
      currentConditions.push(conditionObject);
      Players.update({_id:playerId},{$set:{conditions: currentConditions}});
      console.log(currentConditions);
      console.log("++++++++++++++++++++++++++++++++++++++++")
      return true;
    } else {
      return false;
    }


  },

  popCondition : function(conditionObject, playerId){
    var currentConditions = Players.findOne({_id:playerId, owner:this.userId}).conditions;
    for(var i = 0; i < currentConditions.length; i++){
        if(currentConditions[i].name == conditionObject.name){
            break;
        }
    };
    console.log(currentConditions.splice(i,1));
    console.log(currentConditions);
    Players.update({_id:playerId},{$set:{conditions: currentConditions}});
  },

});
