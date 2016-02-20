angular.module('player-tracker').directive('playView', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/play.html',
    controllerAs: 'playCtrl',
		controller: function ($scope, $reactive, $filter, $rootScope, $stateParams, $meteor, $location, $interval, $http) {
			$reactive(this).attach($scope);
			this.url = $location.absUrl();
			this.gameId = $stateParams.gameId;
			this.subscribe("players", () => [this.gameId]);
			this.subscribe("game", () => [this.gameId]);
			this.subscribe("playerRecord", () => [Meteor.userId()]);
			// $scope.games = $scope.$meteorCollection(Games);
			// $scope.game = {};
			this.showConditons = false;
			this.helpers({
				game(){
					return Games.findOne({_id:$scope.gameId});
				},
				players(){
					return Players.find(
						{game : this.gameId },
						{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
				},
				playerRecord(){
						return Players.findOne({game: this.gameId, owner: Meteor.userId()});
				}
			});
      // $scope.pageTitle = this.game.title;
			console.log($scope.game);
			// $scope.autorun(function(){
			// 	$scope.pageTitle = $scope.game.name;
			// })
			this.autorun(() => {
				// console.log(`current search string is: `, $scope.game.name);
	  	});


			// $scope.$meteorSubscribe('game',$scope.gameId).then(function(){
	    //   // Bind all the todos to $scope.todos
			//
			// 	$scope.game = $meteor.object(Games,$scope.gameId);
			// 	$scope.pageTitle = $scope.game.name;
	    // });

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

			this.healthNegButtons = [];
			this.healthPosButtons = [];
			this.healthDialog = false;

			this.playerId = null;

			// $scope.players = $scope.$meteorCollection(Games);

			//get player record
			// $scope.players = $scope.$meteorCollection(function(){
			// 	return Players.find(
			// 		{game : $scope.getReactively('gameId') },
			// 		{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
			// });
			// $meteor.subscribe('players', $stateParams.gameId);


			//get player record
			// $scope.aPlayer = $meteor.collection(function(){
			// 	return Players.find(
			// 		{game: $scope.gameId, owner: $scope.getReactively('currentUser._id')}
			// 	);
			// });
			//Now some logic. If the user is logged in, then we don't use session. Otherwise, try to retreive some session
			// $meteor.autorun($scope, function() {
			// 	$meteor.subscribe("aplayer", {
			// 		game: $scope.gameId, owner: $scope.getReactively('currentUser._id'), _id: $scope.getReactively("playerId")})
			// 	.then(function(){
			// 		// console.log($scope.currentUser._id);
			// 		console.log("Player 1 is ready ", $scope.aPlayer[0]);
			// 		$scope.playerRecord = $scope.aPlayer[0];
			// 		if($scope.playerRecord){
			// 				$scope.playerId = $scope.playerRecord._id;
			// 		}
			//
			// 	});
			// });

			$scope.$watch("playCtrl.game.battle", function(newValue, oldValue){
				console.log("HIT DISPLAY ENEINGE");
				if(newValue){
					if(angular.equals($scope.playerRecord, {}) !== true){
						console.log("SHOW THE DISPLAY MARTY!");
						$scope.overlay = true;
					}
				}
			});

			$scope.$watch("game.name", function(newValue, oldValue){

				if(newValue){
					$scope.pageTitle = $scope.game.name;
				}
			});

			// if(!Meteor.userId()){
			// 	$scope.playerId = sessionStorage.getItem('playerId');
			// 	$scope.playerRecord = $meteor.object(Players,$scope.playerId);
			// }

			// this.joinGame = function(){
			//
			// 	this.player.game = this.gameId;
			// 	console.log($scope.player);
			// 	$meteor.call("addPlayer",$scope.player)
			// 		.then(function(data) {
			// 			console.log(data);
			// 			this.playerId = data;
			// 			this.playerRecord = $meteor.object(Players,$scope.playerId);
			// 			sessionStorage.setItem('playerId', data);
			// 			// console.log($scope.playerRecord);
			// 			// console.log($scope.playerRecord.name);
			// 		}, function(error) {
			// 			// promise rejected, could log the error with: console.log('error', error);
			// 			console.error(error);
			// 		});
			// };


			this.increaseHealth = (amount) => {
				this.healthDialog = false;
				Meteor.call("increaseHealth", this.playerRecord._id, this.damageInput);


			};




			this.decreaseHealth = (amount) =>{
				this.healthDialog = false;
				Meteor.call("decreaseHealth", this.playerRecord._id, this.damageInput);

			};

			// $scope.healthDialogShow = function(type){
			// 	$scope.healthNegButtons = [];
			// 	$scope.healthPosButtons = [];
			// 	if(type == 'loss'){
			// 		i = 5;
			// 		while(i <= 50){
			// 			$scope.healthNegButtons.push({
			// 				'amount': i,
			// 				'text': '-'+i
			// 			});
			// 			i += 5;
			// 		}
			// 	}
			//
			// 	if(type == 'gain'){
			// 		i = 5;
			// 		while(i <= 50){
			// 			$scope.healthPosButtons.push({
			// 				'amount': i,
			// 				'text': '+'+i
			// 			});
			// 			i += 5;
			// 		}
			// 	}
			// 	$scope.healthDialog = true;
			// };

			this.temporaryForm = () => {
				this.temp = true;
			};

			this.setTemp = () =>{
				this.temp = false;
				Meteor.call("setTempHealth", this.playerRecord._id, {currentHealth:this.tempInput, maxHealth:this.tempInput});
				// $scope.playerRecord.tempHealth = {currentHealth:$scope.tempInput, maxHealth:$scope.tempInput};
			};

			this.becomeDM = () =>{
				console.log("Trying to become DM.");
				Meteor.call("changeGameDM", Meteor.userId(), $scope.game._id, function(error, result){
					if(error){
						//Handle the error
						console.error(error);
					} else {
						console.log("trying to path");
						$location.path("/gm/"+$scope.game._id);
						$scope.$apply();
					}
				});
			};

			this.leave = () => {
				console.log(this.playerRecord);
				console.log("USER IS");
				console.log($meteor.userId);
				Meteor.call("removePlayer",this.playerRecord._id, function(error, result){
					if(error){
						console.error(error);
					} else {
						console.log(data);
						this.playerId = null;
						sessionStorage.clear();
					}
				});
			};

			this.initInit = () => {
				Meteor.call("startBattle", $scope.game._id, function(error, result){
					console.log(error);
					console.log(result);
				});
			};

			this.setInit = () => {
				Meteor.call("setInit", $scope.playerRecord._id, {
					init: $scope.battle.roll,
					round: 0
				});
				$scope.overlay = false;
			};

			this.battlePosition = () =>{
				//filter the array
				if($scope.game.battle){
			  	var foundItem = $filter('filter')($scope.players, { _id: $scope.playerRecord._id  }, true)[0];

			  	//get the index
			  	var index = $scope.players.indexOf(foundItem);
					return index + 1;
				}
			};

			this.endRound = () =>{
				Meteor.call("setInit", $scope.playerRecord._id, function(error, result){});

			};

			this.endBattle = () =>{
				console.log("Ending the fight.");
				Meteor.call('endBattle', $scope.gameId, function(error, result){});
			};

			this.noInit = function(){
				return angular.equals($scope.playerRecord.battle, {});
				// return false;
			};



			this.pushCondition = (conditionIndex) =>{
				console.log("pushing conditon");

				$scope.showConditons = false;

				// if($scope.playerRecord.conditions.indexOf($scope.conditions[conditionIndex])==-1)$scope.playerRecord.conditions.push(angular.copy($scope.conditions[conditionIndex]));

				Meteor.call("pushCondition", angular.copy($scope.conditions[conditionIndex]), $scope.playerRecord._id);
			};

			this.popCondition = (object) => {
				// console.log(index);
				Meteor.call("popCondition", angular.copy(object), $scope.playerRecord._id);


			};
		}
	}
});
