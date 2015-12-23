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
			},
			userId() {
				return Meteor.userId();
			}
		});


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
					$location.path("/play/"+data).replace();
					// $scope.$apply();
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
					$location.path("/play/"+result).replace();
					$scope.$apply();
				}
			});
		};

		$scope.logout = function(){
			Meteor.logout();
		};

		// $meteor.collection("games").find({_id:$scope.partyId});

}]);
