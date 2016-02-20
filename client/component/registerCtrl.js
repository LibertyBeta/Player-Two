angular.module('player-tracker').controller('RegisterCtrl', ['$scope', '$stateParams', '$meteor',
	function ($scope, $stateParams, $meteor) {

		$scope.rForm = {};

		$scope.formSubmit = function() {
			console.log("running submit....");
			console.log($scope.registerForm.$valid);
			if(!$scope.registerForm.$valid) return false;
			$meteor.createUser({
				username: $scope.rForm.user,
				// email:'example@gmail.com',
				password: $scope.rForm.password

			}).then(function(){
				console.log('Login success');

			}, function(err){
				console.log('Login error - ', err);
				$scope.message = err.reason;
			});

		};
}]);
