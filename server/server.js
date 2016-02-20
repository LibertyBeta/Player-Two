Games = new Mongo.Collection('games');
Players = new Mongo.Collection('players');
GMs = new Mongo.Collection('gms');

Games._ensureIndex( { joinCode: 1 }, { unique: true, sparse: true } );

console.log("Server starting up.....");
Players.allow({
	insert: function(userId, doc){
		return true;
	},

	remove: function(userId, doc){
		if(doc.owner == userId){
			return true;
		} else {
			return false;
		}
		console.log("REMOVAL!");
		// return false;
	},
	update: function(userId, doc, fieldNames, modifier){
		var dmCheck  = Games.findOne({_id:doc.game, dm:userId});
		if(userId == doc.owner || dmCheck){
				return true;
		} else {
			return false;
		}
		// return true;
	},
});

Players.deny({
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return true;
  },
  fetch: ['locked'] // no need to fetch 'owner'
});


Games.allow({
	insert: function(userId, doc){
		return true;
	},

	remove: function(userId, doc){

		console.log("REMOVAL!");
		return true;
	},
	update: function(userId, doc, fieldNames, modifier){
		console.log("FALSEHOODS");
		return true;
	},
});

Games.deny({
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return true;
  },
  fetch: ['locked'] // no need to fetch 'owner'
});

Meteor.publish('games', function () {
	return Games.find();
});

Meteor.publish('game', function (id) {
	console.log("Publshing Game with the Id of " + id);
	return Games.find({_id : id});
});

Meteor.publish('players', function (passData) {
	console.log("Subscribing Players for Game ID " + passData);
	// console.log(Players.find({ game : passData },{ $sort : { battle: { init : 1, round: -1 } } }));
	return Players.find({ game : passData });
});

Meteor.publish('playerRecord', function (limiters) {
	// console.log("Subbings for players with limiters of", limiters);
	// console.log(Players.findOne({ owner : this.userId }));
	return Players.find(limiters);
});

Meteor.publish('userGames', function () {
	return Games.find({ users :	 this.userId });
});

Meteor.publish('gms', function () {
	return GMs.find();
});
