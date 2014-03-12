/*
 * Routes loader
 */

'use strict';

var fs = require('fs');

module.exports = function (app, passport) {
    var config = app.get('config');

    // Load all routes.
    var routesDir = __dirname + '/routes';
    fs.readdirSync(routesDir).forEach(function (file) {
        console.log('Routes: loading ' + file);
        if (file[0] === '.') {
            return;
        }
        require(routesDir + '/' + file)(app, passport, config);
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    // === PASSPORT ROUTES    

    // === PASSPORT ROUTES

    // === API

    // === API

    // === END OF THE LINE
    app.get('/404', function (req, res, next) {
        // trigger a 404 since no other middleware
        // will match /404 after this one, and we're not
        // responding here
        next();
    });

    app.get('/403', function (req, res, next) {
        // trigger a 403 error
        var err = new Error('Not allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500', function (req, res, next) {
        // trigger a generic (500) error
        next(new Error('Internal system Error!'));
    });
    // === END OF THE LINE
};