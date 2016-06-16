import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export let GMs = new Mongo.Collection('gms');

if(Meteor.isServer){}
