angular.module('player-tracker').directive('gmView',function(){
	return {
    restrict: 'E',
    templateUrl: 'templates/gm.html',
    controllerAs: 'gmCtrl',
		controller: function ($scope, $stateParams, $meteor, $location, $reactive) {
			$reactive(this).attach($scope);
			$scope.url = $location.absUrl();
			$scope.gameId = $stateParams.gameId;
			$scope.conditions = [
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
			// $scope.subscribe("players", () => [$scope.gameId]);
			$scope.controlsHide = false;
			$scope.npsHide = false;
			$scope.subscribe("players", () => {
				return [$scope.getReactively("gameId")]
			});
			$scope.subscribe("game", () => [$scope.gameId]);
			// $scope.subscribe("playerRecord", () => [Meteor.userId()]);

			$scope.showConditons = false;
			$scope.helpers({
				game(){
					return Games.findOne({_id:$scope.gameId});
				},
				players: () =>{
					return Players.find(
						{},
						{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
				}
				// playerRecord(){
				// 		return Players.findOne({game: $scope.gameId, owner: Meteor.userId()});
				// }
			});
			console.log($scope.players);
			// $scope.autorun(function(){
			// 	$scope.pageTitle = $scope.game.name;
			// })
			$scope.autorun(() => {
				// console.log(`current search string is: `, $scope.game.name);
			});
			$scope.$watch("game.name", function(newValue, oldValue){

				if(newValue){
					$scope.pageTitle = $scope.game.name;
				}
			});

			$scope.addNPC = function(){
				$scope.npc.battle = {init:$scope.npc.init, round:$scope.game.battle.round};
				Meteor.call("addNPC", $scope.npc, $scope.game._id, function(error, result){
					if(error){
						//Handle the error
						console.error(error);
					} else {
						console.log("trying to path");
					}
				});
			};

			$scope.callForInit = function(){
				Meteor.call("startBattle", $scope.game._id, function(error, result){
					console.log(error);
					console.log(result);
				});
			};

			$scope.toggleDisplayNPC = function(){
				Meteor.call("toggleNPC", $scope.game._id, function(error, result){
					console.log(error);
					console.log(result);
				});
			};

			$scope.endTurn = function(){
				console.log($scope.players[0]._id);
				Meteor.call("endRound", $scope.players[0]._id, function(error, result){
					if(error)console.error(error);
				});
			};

			$scope.endRound = function(){
				Meteor.call("advanceRound", $scope.gameId, $scope.players[$scope.players.lenght-1].battle.round, function(error, result){
					if(error) console.error(error);
				})
			};

			$scope.endCombat = function(){
				Meteor.call('endBattle', $scope.gameId, function(error, result){});
			}

			$scope.conditionPopover = function(id){
				$scope.tempId = id;
				$scope.showConditons = true;
			}

			$scope.pushCondition = function(conditionIndex){
				console.log("pushing conditon");

				Meteor.call("pushCondition", angular.copy($scope.conditions[conditionIndex]), $scope.tempId);
				$scope.tempId = null;
				$scope.showConditons = false;
			};

			$scope.toggleControls = function(){
				console.log("ARGE");
				if($scope.controlsHide){
					$scope.controlsHide = false;
				} else {
					$scope.controlsHide = true;
				}
			}

			$scope.toggleNPC = function(){
				console.log("ARGE");
				if($scope.npcHide){
					$scope.npcHide = false;
				} else {
					$scope.npcHide = true;
				}
			}




		}
	}
}
);
