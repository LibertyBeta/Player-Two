

if (Meteor.isClient) {
  // Players.allow({
  //   insert: function(userId, doc){
  //     return false;
  //   },
  //   update: function(userId, doc, fieldNames, modifier){
  //     return false;
  //   },
  //   remove: function(userId, doc){
  //
  //     console.log('userId ' + userId);
  //     return false;
  //   }
  // });
  //
  // Accounts.ui.config({
  //   passwordSignupFields: "USERNAME_ONLY"
  // });
  //
  // // counter starts at 0
  // angular.module('player-tracker',['angular-meteor', 'ui.router', 'ngTouch']);
  //
  // // function onReady() {
  // //   angular.bootstrap(document, ['simple-todos']);
  // // }
  //
  // angular.module('player-tracker').run(['$rootScope', '$state', function($rootScope, $state) {
  //   $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {
  //     if (rejection === 'AUTH_REQUIRED') {
  //       $state.go("home");
  //     }
  //
  //   });
  // }]);
  //
  // angular.module('player-tracker').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  //   function($urlRouterProvider, $stateProvider, $locationProvider){
  //
  //     $locationProvider.html5Mode(true);
  //
  //     // console.log(Meteor.userId());
  //
  //     $stateProvider
  //       .state('home', {
  //         url: '/home',
  //         templateUrl: 'home.ng.html',
  //         controller: 'HomeCtrl'
  //       })
  //       .state('index', {
  //         url: '/',
  //         templateUrl: 'index.ng.html',
  //         controller: 'IndexCtrl'
  //       })
  //       .state('display', {
  //         url: '/display/:gameId',
  //         templateUrl: 'display.ng.html',
  //         controller: 'DisplayCtrl'
  //       })
  //       .state('player', {
  //         url: '/play/:gameId',
  //         templateUrl: 'play.ng.html',
  //         controller: 'PlayerTrackerCtrl'
  //       })
  //       .state('fight', {
  //         url: '/play/:gameId/fight',
  //         templateUrl: 'play-fight.ng.html',
  //         controller: 'PlayerFightCtrl',
  //         resolve: {
  //           'currentUser': ['$meteor', function($meteor){
  //             return $meteor.requireUser();
  //           }]
  //         }
  //       })
  //       .state('gmfight', {
  //         url: '/gm/:gameId/fight',
  //         templateUrl: 'gm-fight.ng.html',
  //         controller: 'GMFightCtrl',
  //         resolve: {
  //           'currentUser': ['$meteor', function($meteor){
  //             return $meteor.requireUser();
  //           }]
  //         }
  //       })
  //       .state('gm', {
  //         url: '/gm/:gameId',
  //         templateUrl: 'gm.ng.html',
  //         controller: 'GMCtrl',
  //         resolve: {
  //           'currentUser': ['$meteor', function($meteor){
  //             return $meteor.requireUser();
  //           }]
  //         }
  //       });
  //
  //     $urlRouterProvider.otherwise('/');
  // }]);

  // angular.module('player-tracker').controller('PlayerTrackerCtrl', ['$scope', '$stateParams', '$meteor',
  //   function ($scope, $stateParams, $meteor) {
  //
  //     $scope.gameId = $stateParams.gameId;
  //
  //     //Now some logic. If the user is logged in, then we don't use session. Otherwise, try to retreive some session
  //
  //     if($meteor.getUser){
  //
  //     } else {
  //       $scope.playerId = sessionStorage.getItem('playerId');
  //     }
  //
  //       $scope.playerRecord = $meteor.object(Players,$scope.playerId);
  //
  //     $meteor.subscribe('players', $stateParams.gameId);
  //     $scope.players = $meteor.collection(Players);
  //
  //     $scope.joinGame = function(){
  //
  //       $scope.player.game = $scope.gameId;
  //       console.log($scope.player);
  //       $meteor.call("addPlayer",$scope.player)
  //         .then(function(data) {
  //           console.log(data);
  //           $scope.playerId = data;
  //           $scope.playerRecord = $meteor.object(Players,$scope.playerId);
  //           sessionStorage.setItem('playerId', data);
  //           // console.log($scope.playerRecord);
  //           // console.log($scope.playerRecord.name);
  //         }, function(error) {
  //           // promise rejected, could log the error with: console.log('error', error);
  //           console.error(error);
  //         });
  //     };
  //
  //     $scope.returnToGame = function(){
  //       $scope.playerRecord = $meteor.object(Players,{recovery : $scope.recovery.recovery, game: $scope.gameId, name: $scope.recovery.playerName});
  //       console.log($scope.playerRecord);
  //       sessionStorage.setItem('playerId',$scope.playerRecord._id);
  //       $scope.playerId = sessionStorage.getItem('playerId');
  //     };
  //
  //     $scope.health = function(maxHealth, currentHealth){
  //       return (currentHealth / maxHealth ) * 100 + "%";
  //     };
  //     $scope.healthRemaining = function(maxHealth, currentHealth){
  //       if(currentHealth == maxHealth) return "100%";
  //       var difference = maxHealth - currentHealth;
  //       return ( difference/ maxHealth ) * 100 + "%";
  //     };
  //
  //     $scope.increaseHealth = function(amount){
  //       if(!angular.equals($scope.playerRecord.tempHealth,{})){
  //         $scope.playerRecord.tempHealth.currentHealth = Math.min($scope.playerRecord.tempHealth.maxHealth,$scope.playerRecord.tempHealth.currentHealth + amount);
  //       } else {
  //         $scope.playerRecord.currentHealth = Math.min($scope.playerRecord.maxHealth, ($scope.playerRecord.currentHealth + amount));
  //       }
  //     }
  //
  //     $scope.decreaseHealth = function(amount){
  //       console.log(angular.equals($scope.playerRecord.tempHealth,{}));
  //       if(angular.equals($scope.playerRecord.tempHealth,{}) === false){
  //         if(0 >= ( $scope.playerRecord.tempHealth.currentHealth - amount)){
  //           $scope.playerRecord.tempHealth = {};
  //         } else {
  //           $scope.playerRecord.tempHealth.currentHealth = $scope.playerRecord.tempHealth.currentHealth - amount;
  //         }
  //       } else {
  //         $scope.playerRecord.currentHealth = Math.max(0, ($scope.playerRecord.currentHealth - amount));
  //       }
  //
  //     }
  //
  //
  //     $scope.temporaryForm = function() {
  //       $scope.temp = true;
  //     }
  //
  //     $scope.setTemp = function(){
  //       $scope.temp = false;
  //       $scope.playerRecord.tempHealth = {currentHealth:$scope.tempInput, maxHealth:$scope.tempInput};
  //     }
  //
  //     $scope.leave = function() {
  //       console.log($scope.playerRecord);
  //       console.log("USER IS");
  //       console.log($meteor.userId);
  //       $meteor.call("removePlayer",$scope.playerRecord._id)
  //         .then(function(data) {
  //           console.log(data);
  //           $scope.playerId = null;
  //           sessionStorage.clear();
  //           // console.log($scope.playerRecord);
  //           // console.log($scope.playerRecord.name);
  //         }, function(error) {
  //           // promise rejected, could log the error with: console.log('error', error);
  //           console.error(error);
  //         });
  //     }
  // }]);

  // angular.module('player-tracker').controller('DisplayCtrl', ['$scope', '$stateParams', '$meteor',
  //   function ($scope, $stateParams, $meteor) {
  //
  //     $scope.gameId = $stateParams.gameId;
  //
  //     $meteor.subscribe('players', $stateParams.gameId);
  //     $scope.players = $meteor.collection(Players);
  //
  //     $scope.displayDetails = true;
  //
  //     $scope.health = function(maxHealth, currentHealth){
  //       return (currentHealth / maxHealth ) * 100 + "%";
  //     };
  //     $scope.healthRemaining = function(maxHealth, currentHealth){
  //       if(currentHealth == maxHealth) return "100%";
  //       var difference = maxHealth - currentHealth;
  //       return ( difference/ maxHealth ) * 100 + "%";
  //     };
  // }]);

  // angular.module('player-tracker').controller('IndexCtrl', ['$scope', '$stateParams', '$meteor',
  //   function ($scope, $stateParams, $meteor) {
  //
  // }]);

  // angular.module('player-tracker').controller('HomeCtrl', ['$scope', '$stateParams', '$meteor', '$location',
  //   function ($scope, $stateParams, $meteor, $location) {
  //
  //     $scope.join = false;
  //     $scope.game = false;
  //     $meteor.subscribe('games');
  //     $scope.games = $meteor.collection(Games);
  //
  //     $scope.joinGame = function(){
  //       console.log("HIT");
  //       // $scope.gameId = "TEST";
  //       $scope.join = true;
  //     };
  //
  //     $scope.joinForm = function(){
  //       $location.path("/play/"+$scope.gameId);
  //     };
  //
  //     $scope.createGame = function() {
  //       // $scope.log("Create game Form");
  //       $scope.game = true;
  //     };
  //
  //     $scope.createForm = function(){
  //
  //       var newDocument = ({
  //         gameName: $scope.gameName
  //       });
  //       console.log(newDocument);
  //       $meteor.call("addGame",newDocument)
  //         .then(function(data) {
  //           console.log(data);
  //           // promise fulfilled
  //           $location.path("/play/"+data);
  //         }, function(error) {
  //           // promise rejected, could log the error with: console.log('error', error);
  //           console.error("ERROR");
  //         });
  //     };
  //
  //     // $meteor.collection("games").find({_id:$scope.partyId});
  //
  // }]);

  // angular.module('player-tracker').directive('ptPlate',function(){
  //   return{
  //     restrict: 'E',
  //     templateUrl: 'player-plate.ng.html'
  //   }
  // });
  //
  // angular.module('player-tracker').directive('ptTop',function(){
  //   return{
  //     restrict: 'E',
  //     templateUrl: 'top.ng.html'
  //   }
  // });

}
//
// Meteor.methods({
//   addGame: function (element) {
//     var promise = Games.insert({
//       name: element.gameName,
//       createdAt: new Date()
//     });
//
//     return promise;
//   },
//
//   addPlayer: function (element) {
//     console.log(element);
//     var promise = Players.insert({
//       name: element.name,
//       currentHealth: element.currentHealth,
//       maxHealth: element.maxHealth,
//       tempHealth: {},
//       game: element.game,
//       recovery: element.recovery,
//       owner: this.userId,
//       createdAt: new Date()
//     });
//
//
//     // console.log(promise);
//     return promise;
//   },
//
//   removePlayer: function (element) {
//     console.log(element);
//     console.log("User id is" + this.userId);
//     var promise = Players.remove({_id:element, owner:this.userId});
//     if(promise == 0 && this.userId === null){
//       throw new Meteor.Error(404,"Player Owner conflict");
//     } else if(promise == 0 && this.userId != null){
//       throw new Meteor.Error(500,"Player Owner conflict");
//     }
//     return promise;
//   },
//
//
// });



// if (Meteor.isServer) {
//   console.log("Server starting up.....");
//
//   Meteor.publish('games', function () {
//     return Games.find();
//   });
//
//   Meteor.publish('players', function (passData) {
//     console.log("Game ID id is " + passData);
//     return Players.find({ game : passData });
//   });
//
//   Meteor.publish('playerRecord', function (id) {
//     return Players.findOne({ _id : id });
//   });
//
//   Meteor.publish('gms', function () {
//     return GMs.find();
//   });
//
// }
