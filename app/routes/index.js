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
        // Validate incoming parameters and set up the paginator
        var viewLimit = Number(req.query.viewLimit);
        viewLimit = (viewLimit > 0) ? viewLimit : 10;
        var currentPage = Number(req.query.currentPage);
        currentPage = (currentPage >= 0) ? currentPage : 0;

        // Issue the request to the Sentinel API
        // https://sentinel.whitehatsec.com/api/site?display_scan_status=1&format=json
        var options = {
            host: 'sentinel.whitehatsec.com',
            path: '/api/site?display_scan_status=1&format=json', //&page:limit=' + viewLimit + 'page:offset=' + currentPage,
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
                var sites = [],
                    pages = [];
                data = JSON.parse(data);

                if (data.status) {
                    req.flash('error', data.message);
                } else {
                    // Make sure we're not off the end of the list.
                    if (currentPage * viewLimit >= data.stats.total_sites) {
                        currentPage = Math.ceil(data.stats.total_sites / viewLimit) - 1;
                    }
                    pages = Navbar.generatePaginatorData(config.url.home, data.stats.total_sites, currentPage, viewLimit);

                    // Right now we grab all the data and paginate. We'll need to change that.
                    var startSite = currentPage * viewLimit;
                    var endSite = (currentPage + 1) * viewLimit;
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
                }
                res.render('index', {
                    sites: sites,
                    pages: pages,
                    flash: UI.bundleFlash(req)
                });
            });
        }).on('error', function (e) {
            console.log('Problem with request: ' + e.message);
            return UI.handleError(req, res, e, config.url.login);
        });
        clientReq.end();
    });
};