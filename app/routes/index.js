/*
 * Index route
 */

'use strict';

var Auth = require('../middleware/authorization');
var https = require('https');
var UI = require('../util/ui_util');
var StatusMap = require('../util/scanStatusMap');

module.exports = function (app, passport, config) {
    // Regular routes
    app.get('/', Auth.isAuthenticated, function (req, res) {
        // https://sentinel.whitehatsec.com/api/site?display_scan_status=1&format=json
        var options = {
            host: 'sentinel.whitehatsec.com',
            path: '/api/site?display_scan_status=1&format=json',
            port: 443,
            headers: {
                'Cookie': 'APID=' + req.user.apid
            },
            method: 'GET'
        };

        var chunks = '';
        var clientReq = https.request(options, function (clientRes) {
            console.log('StatusCode: ' + clientRes.statusCode);
            console.log('Headers: ' + JSON.stringify(clientRes.headers));

            // Restore the chunks of data to a single string.
            clientRes.on('data', function (chunk) {
                chunks += chunk;
            });

            // Process the end event.
            clientRes.on('end', function () {
                console.log('End received: ' + chunks);
                var sites = [];
                chunks = JSON.parse(chunks);
                for (var i = 0; i < chunks.sites.length; i++) {
                    var s = {
                        name: chunks.sites[i].label ? chunks.sites[i].label : chunks.sites[i].site_url,
                        status: []
                    };
                    for (var j = 0; j < chunks.sites[i].scan_status.length; j++) {
                        s.status.push(StatusMap[chunks.sites[i].scan_status[j]]);
                    }
                    sites.push(s);
                }
                res.render('index', {
                    sites: sites
                });
            });
        }).on('error', function (e) {
            console.log('Problem with request: ' + e.message);
            return UI.handleError(req, res, e, config.url.login);
        });
        clientReq.end();
    });
};