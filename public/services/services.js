myApp.factory("Player",function($resource)
{
	return $resource('/users/me',null,
	{
		'sync':{method:'GET'},
		'spendPoint':{method:'GET',isArray:false,params:{spendPoint:true}}
	});
});

myApp.factory("NewParty",function($resource)
{
	return $resource('/parties/we',null,
	{
		'sync':{method:'GET',isArray:true},
		'leave':{method:'GET',isArray:true,params:{leave:true}}
	});
});

myApp.factory("Users",function($resource)
{
	return $resource('/users/:userId',null,
	{
		'invite':{method:'GET',isArray:true,params:{invite:true}},
		'sync':{method:'GET',isArray:true,params:{userId:"all"}}
	});
});

/*myApp.factory("Monsters",function($resource)
{
	return $resource('/monsters/:monsterId',null,
	{
		'add':{method:'GET',isArray:true,params:{new:true,monsterId:"all"}},
		'sync':{method:'GET',isArray:true,params:{monsterId:"all"}},
		'attack':{method:'GET',isArray:true,params:{attack:true}},
	});
});*/

myApp.factory("Battle",function($resource)
{
	return function(type)
	{
		var out = null;
		switch(type)
		{
			case "ping":
				out = $resource('/battle',null,
				{
					'sync':{method:'GET',isArray:false}
				});
				break;
			case "log":
				out = $resource('/battlelog/',null,
				{
					'sync':{method:'GET',isArray:true}
				});
				break;
			case "all":
				out = $resource('/monsters/all',null,
				{
					'add':{method:'GET',isArray:true,params:{new:true}},
					'sync':{method:'GET',isArray:true},
				});
				break;
			case "one":
				out = $resource('/monsters/:monsterId',null,
				{
					'attack':{method:'GET',isArray:true,params:{attack:true}},
				});
				break;
		}
		return out;
	}; 
});


myApp.factory("Consumables",function($resource)
{
	return {
		one: $resource('/consumable/:itemId',null,
		{
			'use':{method:'GET',isArray:true,params:{use:true}},
		}),
		all: $resource('/consumable/all',null,
		{
			'buy':{method:'GET',isArray:true,params:{buy:true}},
			'sync':{method:'GET',isArray:true},
			'use':{method:'GET',isArray:true,params:{use:true}},
		})
	};
});

myApp.factory("Misc",function($resource)
{
	return $resource('/miscellaneous/all',null,
	{
		'sync':{method:'GET',isArray:true}
	});
});