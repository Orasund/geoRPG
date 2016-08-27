"use strict";

var db = require('../../config/sequelize');
/**
 * get
 * requires: party.get
 */
exports.get = function(req,res,next)
{
  if(req.party.BattleId==null)
  {
    req.battlelogs = [];
    return next();
  }
  db.Battle.findById(req.party.BattleId)
  .then(function(battle)
  {
    battle.getBattlelogs()
    .then(function(logs)
    {
      req.battlelogs = logs;
      return next();
    });
  });
};

/**
 * show
 * requires: battlelog.get
 */
exports.show = function(req, res)
{
	res.jsonp(req.battlelogs || []);
}

/***********************
 * show
 * requires: battlelog.get,party.get
 ***********************/
exports.clear = function(req, res, next)
{
  for(var i = 0; i < req.battlelogs.length;i++)
  {
    req.battlelogs[i].destroy();
  }

  db.Battle.findById(req.party.BattleId)
  .then(function(battle)
  {
    battle.setBattlelogs([])
    .then(function()
    {
      next();
    }).catch(function(err)
    {
      return next(err);
    });
  }).catch(function(err)
  {
    return next(err);
  });
}