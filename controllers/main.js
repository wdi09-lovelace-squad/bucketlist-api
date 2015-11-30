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
    doStuff : {
        get : function(req, res) {
            res.json(req.session.lastPutDate || '');
        },
        // Creates new list items
        // Accepts params as JSON { venue: venueName, note: userNote }
        addToList : function(req, res, next) {
            var objID = req.session.passport.user;
            User.findByIdAndUpdate(objID, { $push: { list: { venue: req.body.venue, note: req.body.note} } }, { new: true }).exec().then(function(user) {
            console.log(user.toJSON());
            }).catch(console.error
            ).then(res.sendStatus(200));

        },
        // Updates OK
        patch : function(req, res, next) {
            try {
                if(!req.session.lastPutDate) throw new Error("No date!");
                var date = new Date(req.session.lastPutDate);
                date.setYear(date.getFullYear() + 10);
                req.session.lastPutDate = date.toString();
            } catch(e) {
                return next(e);
            }
            req.session.save(function(err) {
                if(err) return next(err);  // will skip normal middlewares to first error-handling middleware
                res.sendStatus(200);
            });
        },
        // Destroy
        'delete' : function(req, res) {
            delete req.session.lastPutDate;
            res.sendStatus(204);
        },
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
        // This is no Post
    }
};

module.exports = ctrl;
