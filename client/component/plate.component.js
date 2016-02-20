angular.module('player-tracker').directive('ptPlate',function(){
	return{
		restrict: 'E',
		scope: {
      playerRecord: "=?",
			data : "=?",
			showNPC : "=?",
			player : "=?"
    },
		link: function($scope, elem, attr){
			console.log(attr);
			console.log(elem);
			if(attr.type == "gm"){
				$scope.increaseHealth = function(id, amount){
					Meteor.call("increaseHealth", id, amount);
				};

				$scope.decreaseHealth = function(id, amount){
					console.log(id + " . " + amount);
					Meteor.call("decreaseHealth", id, amount);
				};

				$scope.kill = function(id, amount, temp){
					console.log("INFO DUMP", id +"\n"+amount+"\n"+temp);
					if(!angular.equals(temp, {})){
						Meteor.call("decreaseHealth", id, temp.currentHealth);
					} else {
						Meteor.call("decreaseHealth", id, amount);
					}

				};

				$scope.initRoll = function(id,roll){
					Meteor.call("setInit", id, {init:roll, round:0});
				}

				$scope.remove = function(id){
					Meteor.call("removeNPC", id, function(err, result){
						if(err){

						} else {

						}
					})
				};



				$scope.popCondition = function(id, object){
					// console.log(index);
					Meteor.call("popCondition", angular.copy(object), id);
				};
			}

			if(attr.type == "player"){
				$scope.popCondition = function(object){
					Meteor.call("popCondition", angular.copy(object), $scope.data._id);
				};
			}
			$scope.health = function(maxHealth, currentHealth){
				return (currentHealth / maxHealth ) * 100 + "%";
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
			if(attr.type != "gm"){
				$scope.showNPC = function(show, isNPC, battle){
					if(isNPC !== true ) return true;
					// if(show) return true;
					if(show == 1 && !angular.equals({}, battle) && battle.round >= 1) return true;
					else return false;
				}
			}
		},
		templateUrl:  function(elem, attr){
			console.log(attr);
			if(attr.type == "gm"){
				return 'templates/gm-plate.ng.html';
			} if(attr.type=="player"){
				return 'templates/plate.html';
			}else {
				return 'templates/player-plate.html';
			}
		}
	};
});
