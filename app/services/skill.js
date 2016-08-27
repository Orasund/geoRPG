'use strict';

/**
* Module dependencies.
*/
var battleService = require('../../app/services/battle');

exports.fighter = 
{
  "solo":
  {
    "cost":10,
    "calcDamage":function(user,monster,isCriting)
    {
      var damage = battleService.calcDamage(user.atk,monster.def,true,isCriting);
      return Math.round(damage*(1.5));
    }
  }
};