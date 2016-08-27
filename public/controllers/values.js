"use strict";
myApp.constant('monster_dex',{
	rat:
	{
		name:"Ratte",
		max_hp:10,
		atk:1,
		def:0,
		value:7,
		newvalue:1.5,
		power:1
	},
	white_rat:
	{
		name:"Albino Ratte",
		max_hp:10,
		atk:1,
		def:1,
		value:8.5,
		newvalue:2.5
	},
	goblin:
	{
		name:"Goblin",
		max_hp:20,
		atk:2,
		def:0,
		value:8.5,
		newvalue:3
	},
	goblin_king:
	{
		name:"Goblin König",
		max_hp:40,
		atk:1,
		def:1,
		vlaue:12,
		newvalue:4
	}
});

myApp.value('db_battle',
	{
		monsters:[],
		log:[],
		timer:5
	}
);

myApp.value('db_party',
	[
		{
			id:1,
			lv:1,
			name:"Player",
			class:"knight",
			max_hp:100,
			max_sp:100,
			hp:100,
			sp:100,
			atk:6,
		  def:2,
			active_skill:0,
			next_target:0
		},
		{
			id:2,
			lv:1,
			name:"Bot01",
			class:"fighter",
			max_hp:100,
			max_sp:100,
			hp:100,
			sp:100,
			atk:6,
		  def:2,
			active_skill:0,
			next_target:0
		}
	]
);

myApp.constant("class_dex",
{
	knight:
	{
		name:"Ritter",
		skill:
		[
			{
				name:"Schildstoß",
				desc:"macht Schaden in der Höhe des Verteidigungs-Werts.",
				cost:10
			},
			{
				name:"Schutz",
				desc:"setzt eine Runde aus, steckt 50% des Schadens deiner Freunde ein.",
				cost:20
			},
		]
	},
	fighter:
	{
		name:"Kämpfer",
		skill:
		[
			{
				name:"Starker Schlag",
				desc:"verursacht 150% Schaden",
				cost:10
			},
			{
				name:"Kriegsschrei",
				desc:"erhöht die ATK aller Freunde",
				cost:20
			}
		]
	},
	mage:
	{
		name:"Zauberer",
		skill:
		[
			{
				name:"Feuerwand",
				desc:"Schadet alle Gegner mit 50% des normalen Schadens",
				cost:10
			},
			{
				name:"Heilung",
				desc:"heilt alle Freunde.",
				cost:20
			}
		]
	}
});