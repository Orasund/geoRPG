"use strict";

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var monster_dex = require('../../app/constants/monsters');
var config = require('../../app/constants/main');

/*
set the corrent Target
*/
exports.setTarget = function(req, res, next)
{
	if(req.param("attack",false) == false)
		return next();
	req.user.next_target = req.monster.id;
	req.user.active_skill = req.param("skill","none");
	req.user.save()
	.then(function()
	{
		return next();
	}).catch(function(err){return next(err);});
}

/*
show all monsters
*/
exports.all = function(req, res)
{
	res.jsonp(req.monsters || []);
}

var calcPoints = function(name)
{
	var out_atk = monster_dex[name].atk/config.weighting.atk;
	var out_def = monster_dex[name].def/config.weighting.def;
	var out_hp = monster_dex[name].max_hp/config.weighting.hp;
	return (out_atk+out_def+out_hp);
};

var calcExp = function(name)
{
	return calcPoints(name)/calcPoints("rat");
}

/*
find the right monster and store it into req
*/
exports.monster = function(req, res, next, id)
{
	db.Monster.find({ where: {id: id}}).then(function(monster){
			if(!monster) {
					return next(new Error('Failed to load monster ' + id));
			} else {
					req.monster = monster;
					return next();            
			}
	}).catch(function(err){
			return next(err);
	});
};