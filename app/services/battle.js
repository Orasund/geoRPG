var monster_dex = require('../../app/constants/monsters');
var config = require('../../app/constants/main');

exports.calcDamage = function(atk,def,isPlayerAttacking,isCriting)
{
	var out = 0;
	out = atk;
	if(isCriting)
		out*=2;
	else
    out-=def;
	if(out<1)
		out = 1;
	return out;
};

exports.dice = function()
{
	return Math.floor(Math.random()*6)+1;
}

exports.createMonster = function(members)
{
	var calcPoints = function(name)
	{
		var out_atk = monster_dex[name].atk/config.weighting.atk;
		var out_def = monster_dex[name].def/config.weighting.def;
		var out_hp = monster_dex[name].max_hp/config.weighting.hp;
		return (out_atk+out_def+out_hp);
	};

	var calcExp = function(name)
	{
		return Math.round(calcPoints(name)/calcPoints("rat"));
	}

	var getMonsterlist = function(members)
	{
		var monster_list;
		var lowest_level = members[0].lv;
		for(var i=1; i < members.length; i++)
		{
			if(members[i].lv < lowest_level)
				lowest_level = members[i].lv;
		}
		if(lowest_level > 5)
			monster_list = 
			[
				"rat","white_rat","white_rat",
				"goblin","goblin","goblin",
				"goblin","goblin","goblin_king"
			];
		else
			monster_list = 
			[
				"rat","rat","rat",
				"rat","rat","rat",
				"white_rat","white_rat","rat_deamon"
			];
		return monster_list;
	}

  //OUTPUT
  var monster_list = getMonsterlist(members);
	var rand_name = monster_list[Math.floor(Math.random()*monster_list.length)];
	var mob = monster_dex[rand_name];
	mob.typ = rand_name;
	mob.hp = mob.max_hp;
	mob.sp = mob.max_sp;
	mob.exp = calcExp(rand_name);

  mob.item = "none";
  if(mob.droprate>Math.random())
  {
    var rand_item = Math.floor(Math.random()*mob.loot.length);
    mob.item = mob.loot[rand_item];
  }
	return mob;
}