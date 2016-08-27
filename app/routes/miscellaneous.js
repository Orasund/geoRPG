'use strict';

/**
* Module dependencies.
*/
var miscellaneous = require('../../app/controllers/miscellaneous');

module.exports = function(app)
{
	app.get('/miscellaneous/all',
	[
    miscellaneous.get,
    miscellaneous.show
	]);
};