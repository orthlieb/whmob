'use strict';

var _ = require('underscore');
var LocalStrategy = require('passport-local').Strategy;

var https = require('https');

module.exports = function (passport, config) {

    passport.serializeUser(function (user, done) {
        if (_.isArray(user)) {
            user = user[0];
        }
        console.log('**** Serialize user: ' + JSON.stringify(user));
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function (id, done) {
        console.log('**** Deserialize user id: ' + id);
        done(null, JSON.parse(id));
    });

    // Local
    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password'
        },
        function (id, password, done) {
            // Login to the API by posting a password to /api/user/{username}/login and obtain an APID cookie
            var postData = 'password=' + password;
            var postOptions = {
                host: 'sentinel.whitehatsec.com',
                path: '/api/user/' + id + '/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length
                }
            };
            var chunks = '';
            var clientReq = https.request(postOptions, function (clientRes) {
                console.log('StatusCode: ' + clientRes.statusCode);
                console.log('Headers: ' + JSON.stringify(clientRes.headers));

                if (clientRes.statusCode == 401) {
                    return done(false, null);
                }

                // Parse out the cookies as a client
                var cookies = [];
                var unparsedCookies = clientRes.headers['set-cookie'][0];
                unparsedCookies && unparsedCookies.split(';').forEach(function (cookie) {
                    var parts = cookie.split('=');
                    cookies[parts[0].trim()] = (parts[1] || '').trim();
                });

                // Restore the chunks of data to a single string.
                clientRes.on('data', function (chunk) {
                    chunks += chunk;
                });

                // Process the end event.
                clientRes.on('end', function () {
                    console.log('End received: ' + chunks);
                    return done(false, {
                        id: id,
                        apid: cookies.APID
                    });
                });
            }).on('error', function (e) {
                console.log('Problem with request: ' + e.message);
                return done(false, null);
            });
            clientReq.write(postData);
            clientReq.end();
        }
    ));
};