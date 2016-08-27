'use strict';

module.exports = function(sequelize, DataTypes)
{
	var Battlelog = sequelize.define('Battlelog', 
	{
    dice_1: DataTypes.INTEGER,
    dice_2: DataTypes.INTEGER,
    type: DataTypes.STRING,
		name_1: DataTypes.STRING,
		name_2: DataTypes.STRING,
		damage: DataTypes.INTEGER,
		team: DataTypes.STRING
  },
	{
		associate: function(models)
		{
			Battlelog.belongsTo(models.Battle);
		}
	});

	return Battlelog;
};
