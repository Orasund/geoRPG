"use strict";

var db = require('../../config/sequelize');
var miscellaneous_dex = require('../../app/constants/miscellaneous');

/**
 * get
*/
exports.get = function(req,res,next)
{
  req.user.getMiscellaneous()
  .then(function(items)
  {
    req.user.miscellaneous = items;
    next();
  });
};

/**
 * show
 * requires: miscellaneous.get
*/
exports.show = function(req, res)
{
	res.jsonp(req.user.miscellaneous || []);
}