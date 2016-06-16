import {Games} from '../collections/games';
import {Meteor} from 'meteor/meteor';

Meteor.publish('games', function () {
	return Games.find();
});

Meteor.publish('game', function (id: string) {
	console.log("Publshing Game with the Id of " + id);
	return Games.find({_id : id});
});

Meteor.publish('userGames', function () {
	return Games.find({});
});
