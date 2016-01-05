angular.module('player-tracker').controller('GMCtrl', ['$scope', '$stateParams', '$meteor', '$location', '$reactive',
	function ($scope, $stateParams, $meteor, $location, $reactive) {
		$reactive(this).attach($scope);
		$scope.url = $location.absUrl();
		$scope.gameId = $stateParams.gameId;
		$scope.subscribe("players", () => [$scope.gameId]);
		$scope.subscribe("game", () => [$scope.gameId]);
		$scope.subscribe("playerRecord", () => [Meteor.userId()]);

		$scope.showConditons = false;
		$scope.helpers({
			game(){
				return Games.findOne({_id:$scope.gameId});
			},
			players(){
				return Players.find(
					{game : $scope.gameId },
					{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
			},
			playerRecord(){
					return Players.findOne({game: $scope.gameId, owner: Meteor.userId()});
			}
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
		}



}]);
