/*
 * Login route
 */

'use strict';

var UI = require('../util/ui_util');

module.exports = function (app, passport, config) {

    app.get('/login', function (req, res) {
        res.render('login', {
            flash: UI.bundleFlash(req)
        });
    });
    app.post('/login',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: {
                type: 'error',
                message: 'Invalid user name or password.'
            }
        }),
        function (req, res, next) {
            res.redirect(config.url.home);
        }
    );
};