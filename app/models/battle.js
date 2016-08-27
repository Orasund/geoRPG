'use strict';

module.exports = function(sequelize, DataTypes)
{
	var Battle = sequelize.define('Battle', 
	{},
	{
		associate: function(models)
		{
			Battle.hasOne(models.Party);
			Battle.hasMany(models.Battlelog);
			Battle.hasMany(models.Monster);
		}
	});

	return Battle;
};
