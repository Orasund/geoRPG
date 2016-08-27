'use strict';

/**
* Module dependencies.
*/
var battlelogs = require('../../app/controllers/battlelogs');
var parties = require('../../app/controllers/parties');

module.exports = function(app)
{
	app.get('/battlelog/',
	[
    parties.findParty,battlelogs.get,
    battlelogs.show
	]);
};