angular.module('player-tracker').controller('DisplayCtrl', ['$scope', '$stateParams', '$meteor',
	function ($scope, $stateParams, $meteor) {

		$scope.gameId = $stateParams.gameId;

		$meteor.subscribe('players', $stateParams.gameId);
		$scope.players = $meteor.collection(function(){
			return Players.find({ game : $scope.getReactively('gameId') }, {sort:{ 'battle.round' : 1, 'battle.init': -1 }});
		});

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
