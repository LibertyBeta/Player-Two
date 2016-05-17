angular.module('player-tracker').directive('homeView', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/home.html',
    controllerAs: 'homeView',
		controller: function ($scope, $reactive, $stateParams, $meteor, $location) {
			$reactive(this).attach($scope);
			console.log("CONTROLL RUNING");
			$scope.pageTitle = "Home Page";
			this.userId = "NONE";
			this.home = true;
			this.subscribe("userGames", () => { return [ this.getReactively("userId")] });
			this.subscribe("games");
			this.helpers({
				games: () => {
		    	return Games.find({});
		  	},
				ourGames: () => {
					return Games.find({users : this.getReactively("userId")})
				}
			});
			// this.helpers({
			// 	ourGames: () => {
			// 		return Games.find({users : this.getReactively("userId")})
			// 	}
			// });
			this.userId = Meteor.userId();


			this.create = false;
			this.join = false;

			this.joinGame = function(){
				console.log("HIT");
				// this.gameId = "TEST";
				this.join = true;
			};

			this.joinForm = function(){
				Meteor.call("joinGame",this.gameId, function(error, result){
					if(error){
						console.error(error);
					} else {
						console.log(result);
						$location.path("/play/"+data).replace();
						// this.$apply();
					}
				})
			};

			this.createGame = () =>  {
				// this.log("Create game Form");
				this.game = true;
			};

			this.createForm = () => {

				var newDocument = ({
					gameName: this.gameName
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

			this.logout = function(){
				Meteor.logout();
				$location.path("/index");
			};

			// $meteor.collection("games").find({_id:this.partyId});
		}
	}
});
