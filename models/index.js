// jshint node: true

'use strict';

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.model('User', require('./User'));

mongoose.connect(process.env.MONGOLAB_URI);

module.exports = mongoose;
