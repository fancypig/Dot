var configAuth = require('./auth')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
  		done(null, user.id);
  	});

  	passport.deserializeUser(function(id, done){
  		User.findById(id, function(err, user){
  			done(err, user);
  		});
  	});
  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, profile)
    }
  ));
}
