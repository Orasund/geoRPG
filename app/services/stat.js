'use strict';
var db = require('../../config/sequelize');
var config = require('../../app/constants/main');

exports.add = function(user,stat)
{
  var out = new Promise(function(resolve, reject)
  {
    switch(stat)
    {
      case "str":
        user.str++;
        user.atk += config.weighting.atk;
        break;
      case "vit":
        user.vit++;
        user.max_hp += config.weighting.hp;
        user.hp += config.weighting.hp;
        break;
      case "con":
        user.con++;
        user.def += config.weighting.def;
        break;
      default:
        return resolve();
    }
    user.save()
    .then(function()
    {
      resolve(user);
    });
  });
  return out;
}
