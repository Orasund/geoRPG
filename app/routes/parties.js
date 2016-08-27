'use strict';

/**
* Module dependencies.
*/
var parties = require('../../app/controllers/parties');

module.exports = function(app)
{
  app.get('/parties/we',[parties.leave,parties.we]);
};

