angular.module('player-tracker').controller('PlayerTrackerCtrl', ['$scope', '$filter', '$rootScope', '$stateParams', '$meteor', '$location', "$interval",
	function ($scope, $filter, $rootScope, $stateParams, $meteor, $location, $interval) {
		$scope.url = $location.absUrl();
		$scope.gameId = $stateParams.gameId;
		$scope.games = $scope.$meteorCollection(Games);
		$scope.game = {};
		$scope.showConditons = false;
		$scope.$meteorSubscribe('game',$scope.gameId).then(function(){
      // Bind all the todos to $scope.todos

			$scope.game = $meteor.object(Games,$scope.gameId);
			$scope.pageTitle = $scope.game.name;
    });

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

		$scope.healthNegButtons = [];
		$scope.healthPosButtons = [];
		$scope.healthDialog = false;

		$scope.playerId = null;

		$scope.players = $scope.$meteorCollection(Games);

		//get player record
		$scope.players = $scope.$meteorCollection(function(){
			return Players.find(
				{game : $scope.getReactively('gameId') },
				{sort:{ 'battle.round' : 1, 'battle.init': -1 }});
		});
		$meteor.subscribe('players', $stateParams.gameId);


		//get player record
		$scope.aPlayer = $meteor.collection(function(){
			return Players.find(
				{game: $scope.gameId, owner: $scope.getReactively('currentUser._id')}
			);
		});
		//Now some logic. If the user is logged in, then we don't use session. Otherwise, try to retreive some session
		$meteor.autorun($scope, function() {
			$meteor.subscribe("aplayer", {
				game: $scope.gameId, owner: $scope.getReactively('currentUser._id'), _id: $scope.getReactively("playerId")})
			.then(function(){
				// console.log($scope.currentUser._id);
				console.log("Player 1 is ready ", $scope.aPlayer[0]);
				$scope.playerRecord = $scope.aPlayer[0];
				if($scope.playerRecord){
						$scope.playerId = $scope.playerRecord._id;
				}

			});
		});

		$scope.$watch("game.battle", function(newValue, oldValue){
			console.log("HIT DISPLAY ENEINGE");
			if(newValue){
				if(angular.equals($scope.playerRecord, {}) !== true){
					console.log("SHOW THE DISPLAY MARTY!");
					$scope.overlay = true;
				}
			}
		});

		if(!Meteor.userId()){
			$scope.playerId = sessionStorage.getItem('playerId');
			$scope.playerRecord = $meteor.object(Players,$scope.playerId);
		}

		$scope.joinGame = function(){

			$scope.player.game = $scope.gameId;
			console.log($scope.player);
			$meteor.call("addPlayer",$scope.player)
				.then(function(data) {
					console.log(data);
					$scope.playerId = data;
					$scope.playerRecord = $meteor.object(Players,$scope.playerId);
					sessionStorage.setItem('playerId', data);
					// console.log($scope.playerRecord);
					// console.log($scope.playerRecord.name);
				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.error(error);
				});
		};

		$scope.returnToGame = function(){
			$scope.playerRecord = $meteor.object(Players,{recovery : $scope.recovery.recovery, game: $scope.gameId, name: $scope.recovery.playerName});
			console.log($scope.playerRecord);
			sessionStorage.setItem('playerId',$scope.playerRecord._id);
			$scope.playerId = sessionStorage.getItem('playerId');
		};

		$scope.health = function(maxHealth, currentHealth){
			return (currentHealth / maxHealth ) * 100 + "%";
		};
		$scope.healthRemaining = function(maxHealth, currentHealth){
			if(currentHealth == maxHealth) return "100%";
			var difference = maxHealth - currentHealth;
			return ( difference/ maxHealth ) * 100 + "%";
		};

		$scope.increaseHealth = function(amount){
			$scope.healthDialog = false;
			if(!angular.equals($scope.playerRecord.tempHealth,{})){
				$scope.playerRecord.tempHealth.currentHealth = Math.min($scope.playerRecord.tempHealth.maxHealth,$scope.playerRecord.tempHealth.currentHealth + amount);
			} else {
				$scope.playerRecord.currentHealth = Math.min($scope.playerRecord.maxHealth, ($scope.playerRecord.currentHealth + amount));
			}
		};




		$scope.decreaseHealth = function(amount){
			$scope.healthDialog = false;
			if(angular.equals($scope.playerRecord.tempHealth,{}) === false){
				if(0 >= ( $scope.playerRecord.tempHealth.currentHealth - amount)){
					$scope.playerRecord.tempHealth = {};
				} else {
					$scope.playerRecord.tempHealth.currentHealth = $scope.playerRecord.tempHealth.currentHealth - amount;
				}
			} else {
				$scope.playerRecord.currentHealth = Math.max(0, ($scope.playerRecord.currentHealth - amount));
			}

		};

		$scope.healthDialogShow = function(type){
			$scope.healthNegButtons = [];
			$scope.healthPosButtons = [];
			if(type == 'loss'){
				i = 5;
				while(i <= 50){
					$scope.healthNegButtons.push({
						'amount': i,
						'text': '-'+i
					});
					i += 5;
				}
			}

			if(type == 'gain'){
				i = 5;
				while(i <= 50){
					$scope.healthPosButtons.push({
						'amount': i,
						'text': '+'+i
					});
					i += 5;
				}
			}
			$scope.healthDialog = true;
		}

		$scope.temporaryForm = function() {
			$scope.temp = true;
		};

		$scope.setTemp = function(){
			$scope.temp = false;
			$scope.playerRecord.tempHealth = {currentHealth:$scope.tempInput, maxHealth:$scope.tempInput};
		};

		$scope.leave = function() {
			console.log($scope.playerRecord);
			console.log("USER IS");
			console.log($meteor.userId);
			$meteor.call("removePlayer",$scope.playerRecord._id)
				.then(function(data) {
					console.log(data);
					$scope.playerId = null;
					sessionStorage.clear();
					// console.log($scope.playerRecord);
					// console.log($scope.playerRecord.name);
				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.error(error);
				});
		};

		$scope.initInit = function(){
			$meteor.call("startBattle", $scope.game._id).then(function(){});
		};

		$scope.setInit = function(){
			$scope.playerRecord.battle = {
				init: $scope.battle.roll,
				round: 0
			};
			$scope.overlay = false;
		};

		$scope.battlePosition = function(){
			//filter the array
		  var foundItem = $filter('filter')($scope.players, { _id: $scope.playerId  }, true)[0];

		  //get the index
		  var index = $scope.players.indexOf(foundItem);
			return index + 1;
		};

		$scope.endRound = function(){
			$scope.playerRecord.battle.round++;
		};

		$scope.endBattle = function(){
			console.log("Ending the fight.");
			$meteor.call('endBattle', $scope.gameId);
		};

		$scope.noInit = function(){
			return angular.equals($scope.playerRecord.battle, {});
			// return false;
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

		$scope.pushCondition = function(conditionIndex){
			console.log("pushing conditon");

			$scope.showConditons = false;

			// if($scope.playerRecord.conditions.indexOf($scope.conditions[conditionIndex])==-1)$scope.playerRecord.conditions.push(angular.copy($scope.conditions[conditionIndex]));

			$meteor.call("pushCondition", angular.copy($scope.conditions[conditionIndex]), $scope.playerId);
		};

		$scope.popCondition = function(object){
			// console.log(index);
			$meteor.call("popCondition", object, $scope.playerId);
			// if($scope.conditions.lenght === 0 ) $scope.conditions = [];
			// console.log($scope.playerRecord.conditions);

		};

}]);
