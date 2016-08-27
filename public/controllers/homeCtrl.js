myApp.controller('homeCtrl', function ($scope,$interval,geolocation,Player) {
	$scope.coords = {lat:0,long:0};
	geolocation.getLocation().then(function(data){
		$scope.coords.lat=data.coords.latitude;
		$scope.coords.long=data.coords.longitude;
	});

	Player.sync({},function(player)
	{
		if(typeof(player.lv) == "number")
			$scope.page = 'home';
		else
			$scope.page = 'welcome';
	});
	
	$scope.near = function(lat,long)
	{
		x = $scope.coords.lat-lat;
		y = $scope.coords.long-long;
		eps = 0.001;
		return ((x*x+y*y)<=(eps*eps));
	};
});