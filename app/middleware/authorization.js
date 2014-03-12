'use strict';

exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('Auth.isAuthenticated YES');
        next();
    } else {
        console.log('Auth.isAuthenticated NO');
        res.redirect("/login");
    }
};