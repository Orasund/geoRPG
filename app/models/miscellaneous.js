'use strict';

module.exports = function(sequelize, DataTypes)
{
	var Miscellaneous = sequelize.define('Miscellaneous', 
	{
    name: DataTypes.STRING,
		type: DataTypes.STRING,
    amount: {type: DataTypes.INTEGER,defaultValue: 1},
  },
	{
		associate: function(models)
		{
			Miscellaneous.belongsTo(models.User);
		}
	});

	return Miscellaneous;
};
