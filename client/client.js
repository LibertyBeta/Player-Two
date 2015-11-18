Games = new Mongo.Collection('games');
Players = new Mongo.Collection('players');
GMs = new Mongo.Collection('gms');


Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});
