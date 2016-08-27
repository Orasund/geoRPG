'use strict';
var db = require('../../config/sequelize');

exports.leave = function(user)
{
  var out = new Promise(function(resolve, reject)
  {
    //Delete old Party if empty
    db.User.findAndCountAll(
    {
        where: {PartyId: user.PartyId},
        limit: 2
    })
    .then(function(result)
    {
      if(result<2)
      {
        db.Party.destroy(
        {
          where:{id:user.PartyId}
        });
      }
    });

    //Create new Party
    var party = db.Party.build();
    party.save().then(function()
    {
      user.setParty(party.id)
      .then(function(result)
      {
        resolve();
      });
    });
  });
  return out;
}

		
		