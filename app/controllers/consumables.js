"use strict";

var db = require('../../config/sequelize');
var consumable_dex = require('../../app/constants/consumables');

/***********************
 * get
 ***********************/
exports.get = function(req,res,next)
{
  req.user.getConsumables()
  .then(function(items)
  {
    req.user.consumables = items;
    next();
  });
};

/***********************
 * show
 * requires: consumables.get
 ***********************/
exports.show = function(req, res)
{
	res.jsonp(req.user.consumables || []);
}

/***********************
 * use
 * requires: req.consumable
 ***********************/
exports.use = function(req, res, next)
{
  if(req.param("use",false)==false)
    return next();
  req.user.hp += req.consumable.hp;
  if(req.user.hp > req.user.max_hp)
    req.user.hp = req.user.max_hp;
  req.user.sp += req.consumable.sp;
  if(req.user.sp > req.user.max_sp)
    req.user.sp = req.user.max_sp;
  req.consumable.destroy();
  req.user.save()
  .then(function(items)
  {
    next();
  });
}

/***********************
 * buy
 * requires: req.param("consumable")
 ***********************/
exports.buy = function(req, res, next)
{
  if(req.param("buy",false)==false)
    return next();
  var item_name = req.param("name");
  var item = consumable_dex[item_name];
  if(req.user.gold<item.price)
    return next();
  req.user.gold-=item.price;
  req.user.save()
  .then(function()
  {
    item.type = item_name;
    item.UserId = req.user.id;
    db.Consumable.create(item)
    .then(function()
    {
      next();
    });
  });
}

/**
 * consumable
 */
exports.consumable = function(req, res, next, id) {
	db.Consumable.findById(id)
  .then(function(item){
    if(item.UserId != req.user.id)
      next("You are not the owner of this item!");
		req.consumable = item;
		next();
	}).catch(function(err){
		next(err);
	});
};