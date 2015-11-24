// jshint node: true
'use strict';

var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
  dob: {
    type: Date,
    required: true,
    match: /\d{4}-\d{2}-\d{2}/
  },
  name: {
    given: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    }
  },  // end of name
  gender: {
    type: String,
    enum: {
      values: ['f', 'm', 'n', 'o']
    },
    default: 'o'
  } // end of gender
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}); // end profileSchema

// model
var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
