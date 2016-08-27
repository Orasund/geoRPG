'use strict';

module.exports = function(sequelize, DataTypes) {

	var Monster = sequelize.define('Monster', 
	{
		name: DataTypes.STRING,
		typ: DataTypes.STRING,
		max_hp: DataTypes.INTEGER,
		max_sp: DataTypes.INTEGER,
		hp: DataTypes.INTEGER,
		sp: DataTypes.INTEGER,
		atk: DataTypes.INTEGER,
		def: DataTypes.INTEGER,
		exp: DataTypes.INTEGER,
		item: DataTypes.STRING,
	},
	{
		associate: function(models){
			Monster.belongsTo(models.Battle);
		}
	});

	return Monster;
};
