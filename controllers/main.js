// jshint node: true
'use strict';

var passport = require('passport');
var User = require('../models').model('User');

var ctrl = {
    root : {
        get : function(req, res) {
            res.json(req.session);
        },
        middleware : [
            function(req, res, next) {
                if(req.session) {
                    if(!req.session.previousRoutes) {
                        req.session.previousRoutes = [];
                    }
                    req.session.previousRoutes.unshift(req.path);
                    if(req.session.currRequestRoute) {
                        req.session.lastRequestRoute = req.session.currRequestRoute;
                    }
                    req.session.currRequestRoute = req.path;
                }
                next();
            }
        ]
    },

    // bucket list methods
    doStuff : {
        get : function (req, res) {
            var objID = req.session.passport.user;
            User.findById(objID).exec().then(function (user) {
                console.log(user);
                // res.sendStatus(200);
                res.json(user);
            }).catch(console.error);
        },

        // Creates new list items
        // Accepts params as JSON { venue: venueName, note: userNote }
        addToList : function (req, res, next) {
            var objID = req.session.passport.user;
            User.findByIdAndUpdate(objID, {
                $push: {
                    list: {
                        venue: req.body.venue,
                        note: req.body.note
                    }
                }
            }, {
                new: true
            }).exec().then(function (user) {
                console.log(user.toJSON());
            }).catch(console.error).then(res.sendStatus(200));
        }, // end addToList

        // editList
        // check user logged in and body contains venue value
        patch : function(req, res, next) {
            var objID = req.session.passport.user;
            // var venueName = req.body.venue;
            var note = req.body.note;
            var itemID = req.body._id;
            User.update({ _id: objID, 'list._id' : itemID },
            { '$set': {'list.$.note': note }
            }).exec().then(function (user) {
                console.log(user);
            }).catch(console.error).then(res.sendStatus(200));
        }, // end patch function

        // deletes item from BL, by pulling obj from array
        trash : function(req, res) {
            var objID = req.session.passport.user;
            var itemID = req.body._id;
            User.findByIdAndUpdate(objID, {
                $pull: { list: {_id: itemID}}
            }).exec().then(function (user) {
                console.log(user.toJSON());
            }).catch(console.error).then(res.sendStatus(204));
        }, // end delete

        // Index
        'default' : function(err, req, res) {
            res.status(500).
                json({
                    error : {
                        name : err.name,
                        message : err.message
                    }
                });
        }
    } // end doStuff-bucket list methods
};

module.exports = ctrl;
