angular.module('player-tracker').controller('DisplayCtrl', ['$scope','$reactive', '$stateParams', '$meteor',
	function ($scope, $reactive, $stateParams, $meteor) {
		$reactive(this).attach($scope);
		$scope.gameId = $stateParams.gameId;
		this.subscribe("players", () => [$scope.gameId]);
		$scope.helpers({
			players(){
				return Players.find({}, {sort:{ 'battle.round' : 1, 'battle.init': -1 }});
			}
		});
		// console.log($scope.players);
		// $scope.gameId = $stateParams.gameId;

		$scope.displayDetails = true;

		$scope.health = function(maxHealth, currentHealth){
			return (currentHealth / maxHealth ) * 100 + "%";
		};
		$scope.healthRemaining = function(maxHealth, currentHealth){
			if(currentHealth == maxHealth) return "100%";
			var difference = maxHealth - currentHealth;
			return ( difference/ maxHealth ) * 100 + "%";
		};

		$scope.barColor = function(current,max){
			if(current < (max/3)){
				return "danger";
			} else if (current < (max/2)) {
				return "warning";
			} else{
				return "good";
			}
		};
}]);
