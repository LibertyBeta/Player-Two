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
				template: '<home-view></home-view>',
				// templateUrl: 'templates/home.ng.html',
				// controller: 'HomeCtrl',
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
				// templateUrl: 'templates/play.ng.html',
				// controller: 'PlayerTrackerCtrl',
				template: '<play-view></play-view>',
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
				// templateUrl: 'templates/gm-fight.ng.html',
				// controller: 'GMFightCtrl',
				template: '<gm-view></gm-view>',
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
				// templateUrl: 'templates/gm.ng.html',
				// controller: 'GMCtrl',
				template: '<gm-view></gm-view>',
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



angular.module('player-tracker').directive('ptTop',function(){
	return{
		restrict: 'E',
		templateUrl: 'templates/top.ng.html'
	};
});

angular.module('player-tracker').directive('ptCondtions',function(){
	return{
		restrict: 'E',
		scope:{
			conditions:"=",
			player : "=",
			show : "=",
		},
		link: function($scope, elem, attr){
			console.log("SHOW VALUE",$scope.show);
			$scope.pushCondition = (conditionIndex) =>{
				console.log("pushing conditon", conditionIndex + " " + $scope.player);

				$scope.show = false;

				// if($scope.playerRecord.conditions.indexOf($scope.conditions[conditionIndex])==-1)$scope.playerRecord.conditions.push(angular.copy($scope.conditions[conditionIndex]));

				Meteor.call("pushCondition", angular.copy($scope.conditions[conditionIndex]), $scope.player);
			};
		},
		templateUrl: 'templates/conditions.html'
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
