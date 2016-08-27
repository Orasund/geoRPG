"use strict";
myApp.controller('profilCtrl', function ($scope,Player,Users,Consumables,Misc) {
	$scope.page = 'character';
	$scope.player = Player.sync();
	$scope.consumables = [];
	$scope.misc = [];
	Misc.sync(function(misc)
	{
		$scope.misc = misc;
	});

	Consumables.all.sync({},function(items)
	{
		$scope.consumables = items;
	});	

	$scope.spendPoint = function(name)
	{
		Player.spendPoint({stat:name},function(player)
		{
			$scope.player = player;
		});
	}

	$scope.useConsumable = function(id)
	{
		Consumables.one.use({itemId:id},function(items)
		{
			$scope.consumables = items;
			Player.sync({},function(player)
			{
				$scope.player = player;
			});
		});	
	};

	$scope.buyConsumable = function(id)
	{
		Consumables.all.buy({name:id},function(items)
		{
			$scope.consumables = items;
			Player.sync({},function(player)
			{
				$scope.player = player;
			});
		});	
	};
});