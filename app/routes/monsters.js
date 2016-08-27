'use strict';

/**
* Module dependencies.
*/
var monsters = require('../../app/controllers/monsters');
var battles = require('../../app/controllers/battles');
var parties = require('../../app/controllers/parties');
var battlelogs = require('../../app/controllers/battlelogs');

module.exports = function(app)
{
	app.get('/monsters/all',
	[
		parties.findParty,
		battles.new,battles.findMonsters,
		monsters.all
	]);
	app.get('/monsters/:monsterId',
	[
		monsters.setTarget,
		parties.findParty,battles.findMonsters,battlelogs.get,
		battlelogs.clear,
		battles.partyTurn,battles.monstersTurn,
		battles.nextTurn,
		monsters.all
	]);
	app.get('/battle/',battles.showTarget);
	
	app.param('monsterId', monsters.monster);
};

