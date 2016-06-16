import {Players} from '../collections/players';
import {Meteor} from 'meteor/meteor';

Meteor.publish('players', function (passData) {
	console.log("Subscribing Players for Game ID " + passData);
	// console.log(Players.find({ game : passData },{ $sort : { battle: { init : 1, round: -1 } } }));
	return Players.find({ game : passData });
});

Meteor.publish('playerRecords', function (limiters) {
	// console.log("Subbings for players with limiters of", limiters);
	// console.log(Players.findOne({ owner : this.userId }));
	return Players.find(limiters);
});
