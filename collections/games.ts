import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export let Games = new Mongo.Collection<Game>('games');

// Games._ensureIndex( { joinCode: 1 }, { unique: true, sparse: true } );

if(Meteor.isServer){
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


}
