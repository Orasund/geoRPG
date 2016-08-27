"use strict";
myApp.controller('headerCtrl', function ($scope,Player) {
	$scope.player = Player.sync();
});