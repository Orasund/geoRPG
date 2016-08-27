'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var exp = require('../../app/services/exp');
var stat = require('../../app/services/stat');
var config = require('../../app/constants/main');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next)
{
  var message = null;
  
  var user = db.User.build(req.body);
  
  user.provider = 'local';
  user.salt = user.makeSalt();
  user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
  console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
  
  user.atk = config.start_stats.atk;
  user.def = config.start_stats.def;
  user.max_hp = config.start_stats.hp;
  user.hp = config.start_stats.hp;
  user.max_sp = config.start_stats.sp;
  user.sp = config.start_stats.sp;
  user.remaining_points = config.start_stat_points;
  user.save()
  .then(function()
  {
    var party = db.Party.build();
    party.save()
    .then(function()
    {
      user.PartyId = party.id;
      user.save()
      .then(function()
      {
        req.login(user, function(err)
        {
          if(err)
          {
            return next(err);
          }
          res.redirect('/');
        });
      });
    });
  }).catch(function(err){
    res.render('users/signup',{
        message: message,
        user: user
    });
  });
};

/**
 * Send User
 * requires parties.findParty,services/exp.js
 */
exports.me = function(req, res) {
  var out = {
    id: req.user.id,
    lv: req.user.lv,
    name: req.user.name,
    class: req.user.class,
    gold: req.user.gold,
    str: req.user.str,
    con: req.user.con,
    vit: req.user.vit,
    atk: req.user.atk,
    def: req.user.def,
    max_hp: req.user.max_hp,
    max_sp: req.user.max_sp,
    hp: req.user.hp,
    sp: req.user.sp,
    remaining_points: req.user.remaining_points,
    PartyId: req.user.PartyId,
    BattleId: req.party.BattleId,
    next_target: req.user.next_target,
    exp: req.user.exp,
    next_level: exp.calcNextLevel(req.user.lv),
  };

  res.jsonp(out || null);
};

/**
 * shows all users
 * requires config/sequelize.js
 */
exports.all = function(req, res) 
{
	db.User.findAll({attributes:["id","name","class","PartyId"]})
    .then(function(users)
	{
		res.jsonp(users);
	});
};

/**
 * spend a Point on a stat
 * requires services/stat.js
 */
exports.spendPoint = function(req, res, next)
{
  if(req.param("spendPoint",false)==false)
    return next();
  if(req.user.remaining_points<1)
    return next();
  req.user.remaining_points--;
  stat.add(req.user,req.param("stat"))
  .then(function(out)
  {
    req.user = out;
    next();
  });
};

/**
 * Find user by id and store it into req.profile
 */
exports.user = function(req, res, next, id) {
	db.User.find({where : { id: id }}).then(function(user){
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		req.profile = user;
		next();
	}).catch(function(err){
		next(err);
	});
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.status(401).send('User is not authorized');
    }
    next();
};
