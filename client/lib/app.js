angular.module('player-tracker',['angular-meteor', 'ui.router', 'ngTouch','hmTouchEvents']);

angular.module('player-tracker').run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {
		if (rejection === 'AUTH_REQUIRED') {
			$state.go("index");
			console.log("HIT AUTH ERROR");
		}

		if (rejection === 'DM_AUTH_REQUIRED') {
			$state.go("home");
			console.log("HIT AUTH ERROR");
		}
	});

	Accounts.onLogin(function () {
		console.log("Logging in");
    if($state.is('index')){
			$state.go('home');
		}

		if($state.is('login')){
			$state.go('home');
		}

		if($state.is('register')){
			$state.go('home');
		}
  });

	Accounts.onLoginFailure(function () {
			console.log("FAILURE LOGIN");

			if(!$state.is('register') && !$state.is('login')){
				$state.go('index');
			}
			// $state.go('index');

  });

	$rootScope.$watch('currentUser', function(){
		if (!Meteor.loggingIn()) {
			if (Meteor.user() === null) {
				$state.go("index");
			}
		}

	});


}]);

angular.module('player-tracker').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider){

		$locationProvider.html5Mode(true);

		// console.log(Meteor.userId());

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'templates/home.ng.html',
				controller: 'HomeCtrl',
				resolve: {
	      currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() === null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
	    }
		 })
			.state('index', {
				url: '/',
				templateUrl: 'templates/index.ng.html',
				controller: 'IndexCtrl'
			})
			.state('display', {
				url: '/display/:gameId',
				templateUrl: 'templates/display.ng.html',
				controller: 'DisplayCtrl'
			})
			.state('play', {
				url: '/play/:gameId',
				templateUrl: 'templates/play.ng.html',
				controller: 'PlayerTrackerCtrl',
				currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() === null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
			})
			.state('fight', {
				url: '/play/:gameId/fight',
				templateUrl: 'templates/play-fight.ng.html',
				controller: 'PlayerFightCtrl',
				currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() === null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
			})
			.state('gmfight', {
				url: '/gm/:gameId/fight',
				templateUrl: 'templates/gm-fight.ng.html',
				controller: 'GMFightCtrl',
				currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() === null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
			})
			.state('gm', {
				url: '/gm/:gameId',
				templateUrl: 'templates/gm.ng.html',
				controller: 'GMCtrl',
				resolve:{
					currentUser: ($q, $stateParams) => {
		        var deferred = $q.defer();
		        Meteor.autorun(function () {
		          if (!Meteor.loggingIn()) {
								// console.log("checking the dm id" + $stateParams.gameId);
		            if (Meteor.user() === null) {
		              deferred.reject('AUTH_REQUIRED');
								} else {
									//check to make sure the game is DM'ed by the current user
		              deferred.resolve(Meteor.user());
		            }
		          }
		        });

		        return deferred.promise;
		      },
					dm: ($q, $stateParams) =>{
						console.log("checking for the DM. ");
						var deferred = $q.defer();
						Meteor.call("dmCheck", $stateParams.gameId, function(error, result){
							if(error){
								console.log(error);
								deferred.reject('AUTH_REQUIRED');
							} else {
								if(result === true) deferred.resolve(Meteor.user());
								else deferred.reject('DM_AUTH_REQUIRED');
							}
						});
						return deferred.promise;
					}

				}
			})
			.state('register', {
				url: '/register',
				templateUrl: 'templates/register.ng.html',
				controller: 'RegisterCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'templates/login.ng.html',
				controller: 'LoginCtrl',
				currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() != null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
			});

		$urlRouterProvider.otherwise('/');
}]);

angular.module('player-tracker').directive('ptPlate',function(){
	return{
		restrict: 'E',
		link: function($scope, elem, attr){
			if(attr.type == "gm"){
				$scope.increaseHealth = function(id, amount){
					Meteor.call("increaseHealth", id, amount);
				};

				$scope.decreaseHealth = function(id, amount){
					console.log(id + " . " + amount);
					Meteor.call("decreaseHealth", id, amount);
				};

				$scope.kill = function(amount){

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
			if(attr.type == "gm"){
				return 'templates/gm-plate.ng.html';
			} if(attr.type=="player"){
				return 'templates/plate.ng.html';
			}else {
				return 'templates/player-plate.ng.html';
			}
		}
	};
});

angular.module('player-tracker').directive('ptTop',function(){
	return{
		restrict: 'E',
		templateUrl: 'templates/top.ng.html'
	};
});

angular.module('player-tracker').directive('ptCondtions',function(){
	return{
		restrict: 'E',
		templateUrl: 'templates/conditions.ng.html'
	};
});

angular.module('player-tracker').directive('sameAs', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            ngModel.$parsers.unshift(validate);

            // Force-trigger the parsing pipeline.
            scope.$watch(attrs.sameAs, function() {
                ngModel.$setViewValue(ngModel.$viewValue);
            });

            function validate(value) {
                var isValid = scope.$eval(attrs.sameAs) == value;

                ngModel.$setValidity('same-as', isValid);

                return isValid ? value : undefined;
            }
        }
    };
});


angular.module('player-tracker').directive('ngHold', [function () {
    return {
        restrict: "A",
        link: function (scope, elm, attrs) {

        },
        controller: ["$scope", "$element", "$attrs", "$transclude", "$timeout", function ($scope, $element, $attrs, $transclude, $timeout) {
            var onHold = function () {
                return $scope.$eval($attrs.ngHold);
            };
            var onDone = function () {
                return $scope.$eval($attrs.ngHoldDone);
            };

            var intervals = [];
            ($attrs.ngHoldInterval || "500").split(",").forEach(function (interval) {
                intervals.push(interval.split(";"));
            });
            var timeout=null;
            var intervalIdx;
            var intervalCount;

            function timeoutFoo() {
                intervalCount++;
                var max = intervals[intervalIdx].length == 1 ? 1 : intervals[intervalIdx][1];
                if (intervalCount > max) {
                    intervalIdx = Math.min(intervalIdx + 1, intervals.length - 1);
                    intervalCount = 1;
                }
                timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
                onHold();
            }

            $element.on("mousedown", function (e) {
                intervalIdx = 0;
                intervalCount = 1;
                timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
                $scope.$apply(onHold);
            });
            $element.on("mouseup", function (e) {
                if (!!timeout) {
                    $timeout.cancel(timeout);
                    $scope.$apply(onDone);
                    timeout=null;
                }
            });
            $element.on("mouseleave", function (e) {
                if (!!timeout) {
                    $timeout.cancel(timeout);
                    $scope.$apply(onDone);
                    timeout=null;
                }
            });

						$element.on("touchstart", function (e) {
                intervalIdx = 0;
                intervalCount = 1;
                timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
                $scope.$apply(onHold);
            });
            $element.on("touchend", function (e) {
                if (!!timeout) {
                    $timeout.cancel(timeout);
                    $scope.$apply(onDone);
                    timeout=null;
                }
            });
            $element.on("touchcancel", function (e) {
                if (!!timeout) {
                    $timeout.cancel(timeout);
                    $scope.$apply(onDone);
                    timeout=null;
                }
            });
						$element.on("touchmove", function (e) {
                if (!!timeout) {
                    $timeout.cancel(timeout);
                    $scope.$apply(onDone);
                    timeout=null;
                }
            });
        }]
    };
}]);
