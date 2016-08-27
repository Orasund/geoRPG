"use strict";
myApp.controller('battlezoneCtrl', function ($scope,$interval,NewParty,Player,Consumables,Battle)
{
	$scope.page= "fighting";

	$scope.monsters = [0];
	Battle("all").sync({},function(monsters)
	{
		$scope.monsters = monsters;
	});

	var intervallCounter = 0;
	
	var runningBattle = undefined;

	$scope.startBattle = function()
	{
		Battle("all").add({amount:$scope.monster_amount},function(monsters)
		{
			$scope.monsters = monsters
			Player.sync({},function(player)
			{
				$scope.player = player;
			});
		});
	}

	$scope.stopBattle = function()
	{
		if (angular.isDefined(runningBattle))
		{
			intervallCounter = 0;
			$interval.cancel(runningBattle);
			runningBattle = undefined;
			Battle("all").sync({},function(monsters)
			{
				NewParty.sync({},function(party)
				{
					Battle("log").sync({},function(log)
					{
						Player.sync({},function(player)
						{
							$scope.battlelog = log;
							$scope.party = party;
							$scope.monsters = monsters;
							$scope.player = player;
						});
					});
				});
			});
		}
	}

	$scope.battlelog = [];
	Battle("log").sync({},function(log)
	{
		$scope.battlelog = log;
	});
	
	$scope.addLog=function(d1,d2,msg)
	{
		$scope.battlelog.push([d1,d2,msg]);
	}
	$scope.clearLog=function()
	{
		$scope.battlelog = [];
	}
	$scope.Math = window.Math;

	$scope.player = null;
	Player.sync({},function(player)
	{
		$scope.player = player;
		if(player.next_target != 0 &&  player.next_target != null)
		{
			if(intervallCounter != 0)
				$scope.stopBattle();
			else
				runningBattle = $interval(function()
				{
					Battle("ping").sync({},function(target)
					{
						console.log(target);
						if(target[0] == 0 || target[0] == null || intervallCounter>10)
						{
							$scope.stopBattle();
						}
						intervallCounter++;
					});
				}, 2000);
		}
	});
	$scope.monster_amount = 0;
	$scope.mob_placeholder = [
		0,0,0,
		0,0,0,
		0,0,0,
	];

	$scope.syncMonsters = function()
	{
		$scope.monster = Battle("all").sync();
		$scope.party = NewParty.sync();
		$scope.player = Player.sync();
		$scope.battlelog = Battle("log").sync();
	}
	
	NewParty.sync({},function(party)
	{
		$scope.party = party;
		$scope.monster_amount = 3*$scope.party.length;
	});
	
	$scope.addMonster = function()
	{
	  if($scope.monster_amount < 9)
		  $scope.monster_amount++;
	
	}
	$scope.removeMonster = function()
	{
		if($scope.monster_amount > 1)
			$scope.monster_amount--;
	}
	
	$scope.skills = [
		{
			"type":"solo",
			"name":"Starker Schlag",
			"desc":"verursacht 150% Schaden"
		}
	];
	$scope.active_skill = "none";
	$scope.setActiveSkill=function(value)
	{
		$scope.active_skill = value;
	}

	$scope.playTurn=function(enemy)
	{
		$scope.player.next_target = enemy;
		Battle("one").attack({monsterId:enemy,skill:$scope.active_skill},function(monsters)
		{
			NewParty.sync({},function(party)
			{
				Battle("log").sync({},function(log)
				{
					Player.sync({},function(player)
					{
						$scope.monsters = monsters;
						$scope.party = party;
						$scope.battlelog = log;
						$scope.player = player;
						$scope.active_skill = "none";
						if(intervallCounter != 0)
							$scope.stopBattle();
						else
							runningBattle = $interval(function()
							{
								Battle("ping").sync({},function(target)
								{
									console.log(target);
									if(target[0] == 0 || target[0] == null || intervallCounter>10)
									{
										$scope.stopBattle();
									}
									intervallCounter++;
								});
							}, 2000);
					});
				});
			});
		});
	}

	/* CONSUMABLES */
	$scope.consumables = [];
	Consumables.all.sync({},function(items)
	{
		$scope.consumables = items;
	});	

	$scope.useConsumable = function(id)
	{
		Consumables.one.use({itemId:id},function(items)
		{
			$scope.consumables = items;
			NewParty.sync({},function(party)
			{
				$scope.party = party;
			});
		});	
	};

	$scope.buyConsumable = function(id)
	{
		Consumables.all.buy({name:id},function(items)
		{
			$scope.consumables = items;
			NewParty.sync({},function(party)
			{
				$scope.party = party;
			});
		});	
	};
});
