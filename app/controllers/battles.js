'use strict';

/**
* Module dependencies.
*/
var db = require('../../config/sequelize');
var exp = require('../../app/services/exp');
var config = require('../../app/constants/main');
var classes = require('../../app/constants/classes');
var partyService = require('../../app/services/party');
var statService = require('../../app/services/stat');
var miscellaneous_dex = require('../../app/constants/miscellaneous');
var battleService = require('../../app/services/battle');
var skillService = require('../../app/services/skill');

var calcAttack = function(my_dice,en_dice,member,monster,BattleId)
{ 
	var log = db.Battlelog.build();
	log.BattleId = BattleId;
	log.dice_1 = my_dice;
	log.dice_2 = en_dice;
	log.name_1 = member.name;
	log.name_2 = monster.name;
	log.team = "party";
	var damage = 0;
	if(my_dice == 6 && en_dice == 1)
	{
		if(member.active_skill != "none" && typeof skillService[member.class][member.active_skill].calcDamage === 'function')
		{
			damage = skillService[member.class][member.active_skill].calcDamage(member,monster,true);
		}
		else
		{
			damage = battleService.calcDamage(member.atk,monster.def,true,true);
		}
		monster.hp-=damage;

		if(monster.hp<=0)
			log.type = "defeated";
		else
			log.type = "crited";
	}
	else if(my_dice >= en_dice)
	{
		if(member.active_skill != "none" && typeof skillService[member.class][member.active_skill].calcDamage === 'function')
		{
			damage = skillService[member.class][member.active_skill].calcDamage(member,monster,false);
		}
		else
		{
			damage = battleService.calcDamage(member.atk,monster.def,true,false);
		}
		monster.hp-=damage;

		if(monster.hp<=0)
			log.type = "defeated";
		else
			log.type = "hit";
	}
	else
		log.type = "failed";

	log.damage = damage;
	log.save();
	return monster.hp;
}

/**
 * new
 *	creates a new Battle
 * requires: service/battle, parties.findParty
 */
exports.new = function(req, res, next)
{
	if(req.party.BattleId == null && req.param("new",false))
	{
		var battle = db.Battle.build();
		battle.save()
		.then(function()
		{
			for(var i = 0; i < req.param("amount",0);i++)//req.params.amount;i++)
			{
				var mob = battleService.createMonster(req.party.members);
				mob.BattleId = battle.id;
				db.Monster.create(mob)
				.catch(function(err){return next(err);});
			}
			req.party.BattleId = battle.id;
			req.party.save()
			.then(function()
			{
				next();
			}).catch(function(err){return next(err);});
		}).catch(function(err){return next(err);});
	}
	else 
		next();
};

/**
 * findMonsters
 * 	finds all monsters in the current battle and stores them in req.monsters
 * requires: parties.findParty
 */
exports.findMonsters = function(req,res,next)
{
	if(req.party.BattleId == null)
	{
		req.monsters = [];
		return next();
	}
	db.Battle.findById(req.party.BattleId)
	.then(function(battle)
	{
		battle.getMonsters()
		.then(function(monsters)
		{
			req.monsters = monsters;
			return next();
		}).catch(function(err){return next(err);});
	}).catch(function(err){return next(err);});
};

/*
return the corrent target
*/
exports.showTarget = function(req,res)
{
	res.jsonp(req.user.next_target);
};

/*
  battlesyste: partys turn
*/
exports.partyTurn = function(req, res, next)
{
	if(req.param("attack",false))
	{
		for(var i=0; i < req.party.members.length; i++)
		{
			if(req.party.members[i].next_target == 0)
				return next();
		}
		
		for(var i=0; i < req.party.members.length; i++)
		{
			if(req.party.members[i].active_skill != "none")
			{
				var cost = skillService
					[req.party.members[i].class]
					[req.party.members[i].active_skill].cost;
				if(req.party.members[i].sp >= cost)
				{
					req.party.members[i].sp -= cost;
				}
				else
				{
					req.party.members[i].active_skill = "none";
				}
				req.party.members[i].save();	
			}

			var my_dice = battleService.dice();
			var en_dice = battleService.dice();
			
			for(var mob =0; mob < req.monsters.length;mob++)
			{
				if(req.monsters[mob].id != req.party.members[i].next_target)
				{
					continue;
				}
				req.monsters[mob].hp = calcAttack(my_dice,en_dice,req.party.members[i],req.monsters[mob],req.party.BattleId);
				req.monsters[mob].save();
				break;
			}
		}
		
		return next();
	}
	else
		next();
};

/*
Battlesystem: enemys turn
*/
exports.monstersTurn = function(req, res, next)
{
	if(req.param("attack",false)==false)
		return next();
	for(var i=0; i < req.party.members.length; i++)
	{
		if(req.party.members[i].next_target == 0)
			return next();
	}
	
	for(var mob =0; mob < req.monsters.length;mob++)
	{
		if(req.monsters[mob].hp<=0)
			continue;
		var my_dice = battleService.dice();
		var en_dice = battleService.dice();
		var damage = 0;
		var target = Math.floor(Math.random()*req.party.members.length);
		
		var log = db.Battlelog.build();
		log.BattleId = req.party.BattleId;
		log.dice_1 = en_dice;
		log.dice_2 = my_dice;
		log.name_1 = req.monsters[mob].name;
		log.name_2 = req.party.members[target].name;
		log.team = "monsters";

		if(my_dice == 6 && en_dice == 1)
		{
			damage = battleService.calcDamage(req.monsters[mob].atk,req.party.members[target].def,false,true);
			req.party.members[target].hp-=damage;

			if(req.monsters[mob].hp<=0)
				log.type = "defeated";
			else
				log.type = "crited";
		}
		else if(my_dice >= en_dice)
		{
			damage = battleService.calcDamage(req.monsters[mob].atk,req.party.members[target].def,false,false);
			req.party.members[target].hp-=damage;

			if(req.monsters[mob].hp<=0)
				log.type = "defeated";
			else
				log.type = "hit";
		}
		else
		{
			log.type = "failed";
		}

		log.damage = damage;
		log.save();
		req.party.members[target].save();
	}
	return next();
}

/*
Battlesystem: Aftermath
*/
exports.nextTurn = function(req, res, next)
{
	if(req.param("attack",false)==false)
		return next();
	
	for(var i=0; i < req.party.members.length; i++)
	{
		if(req.party.members[i].next_target == 0)
			return next();
	}
	
	//reset targets
	for(var i=0; i < req.party.members.length; i++)
	{
		req.party.members[i].next_target = 0;
		req.party.members[i].active_skill = "none";
		if(req.party.members[i].hp<=0)
		{
			req.party.members[i].hp = req.party.members[i].max_hp/2;
			partyService.leave(req.party.members[i]);
			req.party.members[i].PartyId = null;
		}
		req.party.members[i].save();
	}

	var isPartyAlive = req.party.members.some(function(user)
	{
		return user.PartyId != null;
	});

	var isMobAlive = req.monsters.some(function(monster)
	{
		return monster.hp>0;
	});
	
	if((isPartyAlive == true) && (isMobAlive == true))
		return next();
	if(isMobAlive == false)
	{
		//give exp & gold
		var gold = 0;
		for(var mob =0; mob < req.monsters.length;mob++)
		{
			gold += req.monsters[mob].exp;
			if(req.monsters[mob].item != "none")
			{
				var rand_member = Math.floor(Math.random()*req.party.members.length);
				
				var item = miscellaneous_dex[req.monsters[mob].item];
				//item.UserId = req.party.members[rand_member].id;
				//item.type = req.monsters[mob].item;
				db.Miscellaneous.findOrCreate(
				{
					where: 
					{
						UserId: req.party.members[rand_member].id,
						type: req.monsters[mob].item,
						name: item.name
					}
				})
				.spread(function(obj, created)
				{
					if(created == false)
					{
						obj.amount++;
						obj.save();
					}
				})
				.catch(function(err){return next(err);});
			}
		}
		var exp_pool = Math.floor((req.monsters.length*gold)/req.party.members.length);
		gold = Math.floor(gold/req.party.members.length);
		for(var i=0; i < req.party.members.length; i++)
		{
			if(req.party.members[i].PartyId == null)
				break;
			req.party.members[i].exp += exp_pool;
			req.party.members[i].gold+=gold;
			var next_level = exp.calcNextLevel(req.party.members[i].lv);
			if(req.party.members[i].exp>=next_level)
			{
				req.party.members[i].exp-=next_level;
				req.party.members[i].hp=req.party.members[i].max_hp;
				req.party.members[i].sp=req.party.members[i].max_sp;
				req.party.members[i].lv++;
				req.party.members[i].remaining_points++;
				statService.add(req.user,classes[req.party.members[i].class].stat);
			}
			req.party.members[i].save();
		}
	}

	//remove monsters and battle
	for(var mob =0; mob < req.monsters.length;mob++)
	{
		req.monsters[mob].destroy();
	}

	db.Battle.findById(req.party.BattleId)
	.then(function(battle)
	{
		req.party.BattleId = null;
		req.party.save()
		.then(function()
		{
			battle.destroy()
			.then(function()
			{
				return next();
			});
		});
	});
}

