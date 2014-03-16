/*
 * Index route
 */

'use strict';

var Auth = require('../middleware/authorization');
var https = require('https');
var UI = require('../util/ui_util');
var StatusMap = require('../util/scanStatusMap');
var Navbar = require('../util/navbar');

module.exports = function (app, passport, config) {
    // Home page
    app.get('/', Auth.isAuthenticated, function (req, res) {
        // https://sentinel.whitehatsec.com/api/site?display_scan_status=1&format=json
        var options = {
            host: 'sentinel.whitehatsec.com',
            path: '/api/site?display_scan_status=1&format=json&',
            port: 443,
            headers: {
                'Cookie': 'APID=' + req.user.apid
            },
            method: 'GET'
        };

        var data = '';
        var clientReq = https.request(options, function (clientRes) {
            console.log('StatusCode: ' + clientRes.statusCode);
            console.log('Headers: ' + JSON.stringify(clientRes.headers));

            // Restore the chunks of data to a single string.
            clientRes.on('data', function (chunk) {
                data += chunk;
            });

            // Process the end event.
            clientRes.on('end', function () {
                console.log('End received: ' + data);
                var sites = [];
                data = JSON.parse(data);

                // Validate incoming parameters and set up the paginator
                var viewLimit = (req.params.viewLimit >= 0) ? req.params.viewLimit : 10;
                var currentPage = 0;
                if (req.params.currentPage >= 0 && req.params.currentPage * viewLimit < data.stats.total_sites) {
                    currentPage = req.params.currentPage;
                }
                var pages = Navbar.generatePaginatorData(config.url.home, data.stats.total_sites, currentPage, viewLimit);

                // Temporary: only load the items that need to be loaded. Eventually we'll only load from the API call.
                var startSite = currentPage * viewLimit;
                var endSite = startSite + viewLimit;
                for (var i = startSite; i < endSite; i++) {
                    if (data.sites[i]) {
                        var s = {
                            name: data.sites[i].label ? data.sites[i].label : data.sites[i].site_url,
                            status: []
                        };
                        for (var j = 0; j < data.sites[i].scan_status.length; j++) {
                            s.status.push(StatusMap[data.sites[i].scan_status[j]]);
                        }
                        sites.push(s);
                    }
                }
                res.render('index', {
                    sites: sites,
                    pages: pages
                });
            });
        }).on('error', function (e) {
            console.log('Problem with request: ' + e.message);
            return UI.handleError(req, res, e, config.url.login);
        });
        clientReq.end();
    });
};