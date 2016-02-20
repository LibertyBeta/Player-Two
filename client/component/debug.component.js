angular.module('player-tracker').directive('ptDebug',function(){
	return{
		restrict: 'E',
		scope: {
            data: "="
        },
		templateUrl:
		function(elem, attr){
				console.log(attr);
				if(true){
						return 'templates/debug.html';
				}

			}
	};
});
