'use strict';

/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes)
{
	var User = sequelize.define('User', 
	{
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		username: DataTypes.STRING,
		hashedPassword: DataTypes.STRING,
		provider: DataTypes.STRING,
		salt: DataTypes.STRING, 
		facebookUserId: DataTypes.INTEGER,
		twitterUserId: DataTypes.INTEGER,
		twitterKey: DataTypes.STRING,
		twitterSecret: DataTypes.STRING,
		github: DataTypes.STRING,
		openId: DataTypes.STRING,
		class:	{type: DataTypes.STRING,defaultValue: "fighter"},
		lv:			{type: DataTypes.INTEGER,defaultValue: 1},
		atk:		{type: DataTypes.INTEGER,defaultValue: 3},
		def:		{type: DataTypes.INTEGER,defaultValue: 3},
		max_hp:	{type: DataTypes.INTEGER,defaultValue: 80},
		max_sp:	{type: DataTypes.INTEGER,defaultValue: 80},
		hp:			{type: DataTypes.INTEGER,defaultValue: 80},
		sp:			{type: DataTypes.INTEGER,defaultValue: 80},
		gold:		{type: DataTypes.INTEGER,defaultValue: 0},
		exp:		{type: DataTypes.INTEGER,defaultValue: 0},
		str:		{type: DataTypes.INTEGER,defaultValue: 0},
		con:		{type: DataTypes.INTEGER,defaultValue: 0},
		vit:		{type: DataTypes.INTEGER,defaultValue: 0},
		active_skill:{type: DataTypes.STRING,defaultValue: "none"},
		next_target:{type: DataTypes.INTEGER,defaultValue: 0},
		remaining_points:{type: DataTypes.INTEGER,defaultValue: 0},
	},
	{
		instanceMethods:
		{
			toJSON: function ()
			{
				var values = this.get();
				delete values.hashedPassword;
				delete values.salt;
				return values;
			},
			makeSalt: function()
			{
				return crypto.randomBytes(16).toString('base64'); 
			},
			authenticate: function(plainText)
			{
				return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
			},
			encryptPassword: function(password, salt)
			{
				if (!password || !salt)
					return '';
				salt = new Buffer(salt, 'base64');
				return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
			}
		},
		associate: function(models)
		{
			User.hasMany(models.Article);
			User.hasMany(models.Consumable);
			User.hasMany(models.Miscellaneous);
			User.belongsTo(models.Party);
			User.belongsToMany(models.Party,
			{
				as:"PartyInvites", through:"PartyInvites"
			});
		}
	});

	return User;
};