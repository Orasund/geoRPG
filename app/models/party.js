'use strict';

module.exports = function(sequelize, DataTypes)
{
	var Party = sequelize.define('Party', 
	{},
	{
		associate: function(models)
		{
			Party.hasMany(models.User,{as:'PartyMembers'});
			Party.belongsToMany(models.User,{as:'Invites',through: "PartyInvites"});
			Party.belongsTo(models.Battle);
		}
	});

	return Party;
};
