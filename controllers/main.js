'use strict';

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
        // Reads "Sun Nov 23 2025 14:02:35 GMT-0500 (EST)"
        get : function(req, res) {
            res.json(req.session.lastPutDate || '');
        },
        // Creates Created??
        put : function(req, res, next) {
            var now = new Date(Date.now());
            req.session.lastPutDate = (now).toString();
            req.session.save(function(err) {
                if(err) {
                    next(err);
                    return;
                }

                res.sendStatus(201);
            });
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
