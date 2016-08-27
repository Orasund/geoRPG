"use strict";
var myApp=angular.module('myApp',["ngRoute","ngResource","geolocation"]);
myApp.config(function($routeProvider) {
	$routeProvider
	.when("/",
	{
			templateUrl : "home.html",
			controller : "homeCtrl"
	})
	.when("/tavern",
	{
			templateUrl : "tavern.html",
			controller : "tavernCtrl"
	})
	.when("/battlezone",
	{
			templateUrl : "battlezone.html",
			controller : "battlezoneCtrl"
	})
	.when("/quest",
	{
			templateUrl : "quest.html",
			controller : "questCtrl"
	})
	.when("/character",
	{
			templateUrl : "profil.html",
			controller : "profilCtrl"
	})
	.when("/signup",
	{
		templateUrl : "signup.html"
	});
});
  