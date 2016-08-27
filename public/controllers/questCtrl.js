"use strict";
myApp.controller('questCtrl', function ($scope,geolocation,NewParty,Users,Player) {
	$scope.page = 'quests';
	$scope.player = Player.sync();
	$scope.party = NewParty.sync();
	$scope.users = Users.sync();
	
	$scope.leaveParty = function()
	{
		$scope.party = NewParty.leave();
	};
	
	$scope.sendPartyInvite = function(id)
	{
		Users.invite({userId:id},function(users)
		{
			$scope.users = users;
			NewParty.sync({},function(party)
			{
				$scope.party = party;
			});
		});
	};
});