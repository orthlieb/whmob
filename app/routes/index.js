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
        var currentPage = Number(req.query.currentPage);
        currentPage = (currentPage >= 0) ? currentPage : 0;
        var navOptions = {
            numItemsInPage: Number(req.query.numItemsInPage) > 0 ? Number(req.query.numItemsInPage) : 15,
            numNavButtons: Number(req.query.numNavButtons) > 0 ? Number(req.query.numNavButtons) : 5,
            showEndButtons: /^true$/i.test(req.query.showEndButtons)
        }

        // Issue the request to the Sentinel API
        // https://sentinel.whitehatsec.com/api/site?display_scan_status=1&format=json
        var options = {
            host: 'sentinel.whitehatsec.com',
            path: '/api/site?display_scan_status=1&format=json&page:limit=' + navOptions.numItemsInPage + '&page:offset=' + (currentPage * navOptions.numItemsInPage),
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
                    if (currentPage * options.numItemsInPage >= data.stats.total_sites) {
                        currentPage = Math.ceil(data.stats.total_sites / options.numItemsInPage) - 1;
                    }
                    pages = Navbar.generatePaginatorData(config.url.home, data.stats.total_sites, currentPage, navOptions);

                    // Right now we grab all the data and paginate. We'll need to change that.
                    for (var i = 0; i < data.sites.length; i++) {
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