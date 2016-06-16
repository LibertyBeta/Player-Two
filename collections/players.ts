import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export let Players = new Mongo.Collection<Player>('players');

if(Meteor.isServer){
  Players.allow({
  	insert: function(userId, doc){
  		return true;
  	},

  	remove: function(userId, doc){
      return true;
  		// if(doc.owner == userId){
  		// 	return true;
  		// } else {
  		// 	return false;
  		// }

  		// return false;
  	},
  	update: function(userId, doc, fieldNames, modifier){
  		// var dmCheck  = Games.findOne({_id:doc.game, dm:userId});
      // let dmCheck = true;
  		// if(userId == doc.owner || dmCheck){
  		// 		return true;
  		// } else {
  		// 	return false;
  		// }
  		return true;
  	},
  });


}
