'use strict';

var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// export a mongoose model

var userSchema = new Schema({
  userName : {
    type : String,
    unique : true,
    required : true
  },
  passwordDigest : String
});

userSchema.plugin(uniqueValidator);

userSchema.methods.comparePassword = function(password) {
  var self = this;

  return new Promise(function(res, rej) {
    bcrypt.compare(password, self.passwordDigest, function(err, match) {
      if(err) {
        rej(err);
        return;
      }

      res(match);
    });
  });
};

userSchema.methods.setPassword = function(password) {
  // we will need to reference 'this' inside a function we create here
  var self = this;
  // create a new promise and assign it to 'saltPromise'
  var saltPromise = new Promise(function saltExec(res, rej) {
    // call method to generate a 16-byte salt for use in computing the digest
    bcrypt.genSalt(16, function(err, salt) {
      if(err) {
        rej(err);
        return;
      }
      res(salt);
    });
  });

  // declare 'returnedPromise' is a variable,
  // assign 'saltPromise' and call '.then' method with 'salt' function
  var returnedPromise = saltPromise.then(function(salt) {
    // returns a new Promise with the 'hashExec' function
    return new Promise(function hashExec(res, rej) {
      // call method to generate password-hash for use in computing the digest
      bcrypt.hash(password, salt, function(err, digest) {
        if(err) {
          rej(err);
          return;
        }
        res(digest);
      });
    });
  // call '.then' method with 'digest' function
  }).then(function(digest) {
    // passwordDigest is in Schema
    self.passwordDigest = digest;
    return self.save();
  });
  return returnedPromise;
};  // end password function

module.exports = userSchema;
