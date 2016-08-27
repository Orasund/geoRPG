'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var partyService = require('../../app/services/party');

/**
 * Find user by id
 */
exports.party = function(req, res, next, id)
{
	db.Party.find({where : { id: id }}).then(function(party){
		if (!party) {
				return next(new Error('Failed to load Party ' + id));
		}
		req.party = party;
		next();
	}).catch(function(err){
		next(err);
	});
};

/*
find the corrent party, and party members and store them into req
*/
exports.findParty = function(req,res,next)
{
	db.Party.findById(req.user.PartyId)
	.then(function(party)
	{
		req.party = party;
		party.getPartyMembers()
		.then(function(users)
		{
			req.party.members = users;
			next();
		}).catch(function(err)
		{
			next(err);
		});
	}).catch(function(err)
	{
		next(err);
	});
};

/**
 * Send Party
 */
exports.we = function(req, res) {
	db.User.findAll(
	{
		attributes:["id","lv","name","class","max_hp","max_sp","hp","sp"],
		where: {PartyId: req.user.PartyId}
	}).then(function(party)
	{
		res.jsonp(party);
	});
};

/*
leave the old party
*/
exports.leave = function(req, res, next)
{
	if(req.param("leave",false))
	{
		partyService.leave(req.user)
		.then(function()
		{
			next();
		});
	}
  else
	  next();
};

/*
invite a player into your party
*/
exports.invite = function(req, res, next) {
	if(req.param("invite",false))
	{
		/*req.user.addPartyInvite(req.profil.PartyId).then(function()
		{
			next();
		});*/
		db.User.findById(req.param("userId"))
		.then(function(target)
		{
			//Destroy old party if empty
			db.User.findAndCountAll(
			{
				 where: {PartyId: target.PartyId},
				 limit: 2
			})
			.then(function(result)
			{
				if(result<2)
				{
					db.Party.destroy(
					{
						where:{id:req.user.PartyId}
					});
				}
			}).catch(function(err){
				next(err);
			});
			
			//chance party
			target.setParty(req.user.PartyId)
			.then(function()
			{
				next();
			}).catch(function(err){
				next(err);
			});
		}).catch(function(err){
			next(err);
		});
	}
	else
  	next();
};

/**
 * Article authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.party.id !== req.user.PartyId) {
      return res.send(401, 'User is not authorized');
    }
    next();
};