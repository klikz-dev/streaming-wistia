'use strict';

var ums = require('node-ums');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./index');
var serializer = require('node-serialize');


//Configure the serialization for the login
passport.serializeUser(function(user, done) {
  if (config.internalUMSEnabled) {
    done(null, user.id);
  } else {
    done(null, serializer.serialize(user));
  }
});

passport.deserializeUser(function(user, done) {
  if (config.internalUMSEnabled) {
    var id = user;
    ums.api.getUserById(id).then(function(user) {
      done(null, user);
    }, done);
  } else {
    done(null, serializer.unserialize(user));
  }
});

// Configure the local strategy to login via our own UMS
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  ums.api.login(email, password).then(function(user) {
    done(null, user, {
      message: 'Success! You are logged in'
    });
  }).catch(function(err) {
    done(null, false, {
      message: err.message
    });
  });
}));

// // Allow login via Facebook
// var fbConfig = config.passport.facebook;
// passport.use(new FacebookStrategy({
//   clientID: fbConfig.clientID,
//   clientSecret: fbConfig.clientSecret,
//   callbackURL: fbConfig.callbackUrl.replace('{port}', config.port),
//   profileFields: ['id', 'email', 'displayName']
// }, ums.api.authFacebook));

module.exports.init = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};
