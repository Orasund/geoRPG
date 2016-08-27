'use strict';

module.exports = function(sequelize, DataTypes)
{
	var Consumable = sequelize.define('Consumable', 
	{
    name: DataTypes.STRING,
		type: DataTypes.STRING,
    hp: DataTypes.INTEGER,
		sp: DataTypes.INTEGER,
		alchemy: DataTypes.STRING,
  },
	{
		associate: function(models)
		{
			Consumable.belongsTo(models.User);
		}
	});

	return Consumable;
};
