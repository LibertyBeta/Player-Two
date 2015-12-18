angular.module('player-tracker').controller('LoginCtrl', ['$scope', '$stateParams', '$meteor',
	function ($scope, $stateParams, $meteor) {
		$scope.lForm = {};

		$scope.formSubmit = function() {
			console.log("running submit....");
			console.log($scope.loginForm.$valid);
			if(!$scope.loginForm.$valid) return false;
			Meteor.loginWithPassword($scope.lForm.user, $scope.lForm.password, function(error, result){
				if(error){
					console.log('Login success');
				} else {
					console.log('Login error - ', err);
					$scope.message = err.reason;
				}
			});


		};
}]);
