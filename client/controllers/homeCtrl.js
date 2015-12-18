angular.module('player-tracker').controller('HomeCtrl', ['$scope', '$reactive', '$stateParams', '$meteor', '$location',
	function ($scope,$reactive, $stateParams, $meteor, $location) {
		$reactive(this).attach($scope);
		$scope.join = false;
		$scope.game = false;
		$scope.pageTitle = "Home Page";
		this.subscribe("games");
		$scope.helpers({
			userGames() {
				return Games.find({users:Meteor.userId()})
			}
		});
		// this.helpers({
		// 	userGames: () => {
		// 		return Games.find({users:Meteor.userId()})
		// 	}
		// });
		// $meteor.subscribe('games');
		// $scope.userGames = [];
		// $scope.subscribe('games', () => {
		// 	return [
		// 		$scope.userGames
		// 	]
		// });
		// $scope.userGames = $meteor.collection(function(){
		// 	return Games.find(
		// 		{users: $scope.getReactively('currentUser._id')}
		// 	);
		// });
		//Now some logic. If the user is logged in, then we don't use session. Otherwise, try to retreive some session
		// $meteor.autorun($scope, function() {
		// 	$meteor.subscribe("userGames", {
		// 		users: $scope.getReactively('currentUser._id')})
		// 	.then(function(){
		// 		// console.log($scope.currentUser._id);
		// 		console.log("Games are Ready");
		//
		// 	});
		// });
		// $scope.games = $meteor.collection(Games);

		$scope.create = false;
		$scope.join = false;

		$scope.joinGame = function(){
			console.log("HIT");
			// $scope.gameId = "TEST";
			$scope.join = true;
		};

		$scope.joinForm = function(){
			Meteor.call("joinGame",$scope.gameId, function(error, result){
				if(error){
					console.error(error);
				} else {
					console.log(result);
					// $location.path("/play/"+data);
				}
			})
		};

		$scope.createGame = function() {
			// $scope.log("Create game Form");
			$scope.game = true;
		};

		$scope.createForm = function(){

			var newDocument = ({
				gameName: $scope.gameName
			});
			console.log(newDocument);
			Meteor.call("addGame",newDocument, function(error, result){
				if(error){
					console.error("ERROR");
				} else {
					console.log(result);
					// promise fulfilled
					$location.path("/play/"+result);
				}
			});
		};

		$scope.logout = function(){
			Metor.logout();
		};

		// $meteor.collection("games").find({_id:$scope.partyId});

}]);
