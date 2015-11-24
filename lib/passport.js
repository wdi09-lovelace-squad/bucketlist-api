'use strict';
/**REQUIRES
 *  passport
 *  passport-local
 *  user model
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('../models');
var User = mongoose.model('User');


/**DEFINITIONS
 *  passport methods:
 *    passport.serializeUser
 *    passport.deserializeUser
 *  objects:
 *    local strategy instance
 *
 */

// 'serializeUser' method reduces User to a serial number
passport.serializeUser(function(user, done) {
  // stores the user.id in the session??
  done(null, user.id);
});

// 'deserializeUser' method finds User and does what??
passport.deserializeUser(function(id, done) {
  User.findById(id).exec().then(function(user) {
    done(null, user);
  }).catch(function(err) {
    done(err);
  });
});

var localStrat = new LocalStrategy(function(username, password, done) {
  // get Joe from database??
  User.findOne({
    userName : username
  // exec runs query and returns promise to us
  // '.then' method and 'user' function
  }).exec().then(function(user) {
    // if user doesn't exist return false
    if(!user) {
      return done(null, false);
    }
    // if user does exist, declare 'p' and assign to user
    var p = user.comparePassword(password).then(function(match) {
      // a boolean to match user
      done(null, match ? user : false);
    });
    return p;
  // '.catch' method and 'err' function
  }).catch(function(err) {
    done(err);
  });
}); // end LocalStrategy function

/**INVOCATIONS
 *  passport.use:
 *    local strategy instance
 *
 */
passport.use(localStrat);

module.exports = passport;
