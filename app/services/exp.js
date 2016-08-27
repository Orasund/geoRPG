'use strict';
var config = require('../../app/constants/main');

exports.calcNextLevel = function(lv)
{
	var l = Math.log(1+config.expRaseInProcent);
	return Math.floor(config.expForFristLevel*Math.exp(l*lv));
};