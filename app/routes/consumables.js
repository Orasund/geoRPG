'use strict';

/**
* Module dependencies.
*/
var consumables = require('../../app/controllers/consumables');

module.exports = function(app)
{
	app.get('/consumable/all',
	[
    consumables.buy,
    consumables.get,
    consumables.show
	]);
	app.get('/consumable/:itemId/',
	[
    consumables.use,
    consumables.get,
    consumables.show
	]);

  app.param('itemId', consumables.consumable);
};