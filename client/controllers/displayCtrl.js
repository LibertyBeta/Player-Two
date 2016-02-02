angular.module('player-tracker').controller('DisplayCtrl', ['$scope','$reactive', '$stateParams', '$meteor',
	function ($scope, $reactive, $stateParams, $meteor) {
		$reactive(this).attach($scope);
		$scope.gameId = $stateParams.gameId;
		$scope.subscribe("players", () => [$scope.gameId]);
		$scope.subscribe("game", () => [$scope.gameId]);
		$scope.helpers({
			game(){
				return Games.findOne({_id:$scope.gameId});
			},
			players(){
				return Players.find({}, {sort:{ 'battle.round' : 1, 'battle.init': -1 }});
			}
		});
		// console.log($scope.players);
		// $scope.gameId = $stateParams.gameId;

		$scope.displayDetails = true;


}]);
