angular.module('player-tracker').directive('gmView',function(){
	return {
    restrict: 'E',
    templateUrl: 'templates/gm.html',
    controllerAs: 'gmCtrl',
		controller: function ($scope, $stateParams, $meteor, $location, $reactive) {
			$reactive(this).attach($scope);
			this.url = $location.absUrl();
			this.gameId = $stateParams.gameId;
			this.conditions = [
				{
					'style':'condition-posion',
					// 'hint':"YOU'RE POSIONED FOOL!",
					'name':'posion',
				},
				{
					'style':'condition-exhuast',
					// 'hint':"YOU'RE exhuasted FOOL!",
					'name':'exhuasted',
				},
				{
					'style':'condition-blind',
					// 'hint':"YOU'RE blind FOOL!",
					'name':'blind',
				},
				{
					'style':'condition-prone',
					// 'hint':"YOU'RE prone FOOL!",
					'name':'prone',
				}
			];
			// this.subscribe("players", () => [this.gameId]);
			this.controlsHide = false;
			this.npsHide = false;
			this.subscribe("players", () => {
				return [this.getReactively("gameId")]
			});
			this.subscribe("game", () => [this.gameId]);
			// this.subscribe("playerRecord", () => [Meteor.userId()]);

			this.showConditons = false;
			this.helpers({
				game(){
					return Games.findOne({_id:this.gameId});
				},
				players: () =>{
					return Players.find(
						{},
						{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
				}
				// playerRecord(){
				// 		return Players.findOne({game: this.gameId, owner: Meteor.userId()});
				// }
			});
			console.log(this.players);
			// this.autorun(function(){
			// 	this.pageTitle = this.game.name;
			// })
			this.autorun(() => {
				// console.log(`current search string is: `, this.game.name);
			});
			$scope.$watch("game.name", function(newValue, oldValue){

				if(newValue){
					$scope.pageTitle = $scope.game.name;
				}
			});

			this.addNPC = function(){
				this.npc.battle = {init:this.npc.init, round:this.game.battle.round};
				Meteor.call("addNPC", this.npc, this.game._id, function(error, result){
					if(error){
						//Handle the error
						console.error(error);
					} else {
						console.log("trying to path");
					}
				});
			};

			this.callForInit = function(){
				Meteor.call("startBattle", this.game._id, function(error, result){
					console.log(error);
					console.log(result);
				});
			};

			this.toggleDisplayNPC = function(){
				Meteor.call("toggleNPC", this.game._id, function(error, result){
					console.log(error);
					console.log(result);
				});
			};

			this.endTurn = function(){
				console.log(this.players[0]._id);
				Meteor.call("endRound", this.players[0]._id, function(error, result){
					if(error)console.error(error);
				});
			};

			this.endRound = function(){
				Meteor.call("advanceRound", this.gameId, this.players[this.players.lenght-1].battle.round, function(error, result){
					if(error) console.error(error);
				})
			};

			this.endCombat = function(){
				Meteor.call('endBattle', this.gameId, function(error, result){});
			}

			this.conditionPopover = function(id){
				this.tempId = id;
				this.showConditons = true;
			}

			this.pushCondition = function(conditionIndex){
				console.log("pushing conditon");

				Meteor.call("pushCondition", angular.copy(this.conditions[conditionIndex]), this.tempId);
				this.tempId = null;
				this.showConditons = false;
			};

			this.toggleControls = function(){
				console.log("ARGE");
				if(this.controlsHide){
					this.controlsHide = false;
				} else {
					this.controlsHide = true;
				}
			}

			this.toggleNPC = function(){
				console.log("ARGE");
				if(this.npcHide){
					this.npcHide = false;
				} else {
					this.npcHide = true;
				}
			}




		}
	}
}
);
