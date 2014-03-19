var _ = require('underscore');

'use strict';

exports.generatePaginatorData = function Paginate(url, numSites, currentPage, options) {
    var defaults = {
        numItemsInPage: 15, // Number of individual items on each page
        numNavButtons: 5, // Number of nav buttons to display
        showEndButtons: true // Show first/last end buttons
    }
    options = _.defaults(options, defaults);

    // Set up data structure used by the paginator.
    // Note that currentPage and startPage and lastPage are zero-based.
    var pages = [];
    // Total number of pages to display
    var numPages = Math.ceil(numSites / options.numItemsInPage);
    // Number of pages to display as nav buttons in the nav bar at a time
    options.numNavButtons = Math.min(options.numNavButtons, numPages);
    // Start page for this window
    var startPage = Math.floor(currentPage / options.numNavButtons) * options.numNavButtons;
    // Last page in the entire set of views
    var lastPage = numPages - 1;

    var endStuff = '&numItemsInPage=' + options.numItemsInPage + '&numNavButtons=' +
        options.numNavButtons + '&showEndButtons=' + options.showEndButtons;

    // Go to beginning.
    if (options.showEndButtons) {
        pages.push({
            title: '<<',
            state: (startPage <= 0 ? 'disabled' : 'normal'),
            url: url + '?currentPage=0' + endStuff
        });
    }

    // Page backward one page
    pages.push({
        title: '<',
        state: (currentPage <= 0 ? 'disabled' : 'normal'),
        url: url + '?currentPage=' + (currentPage - 1) + endStuff
    });

    // Middle pages
    for (var i = startPage; i < (startPage + options.numNavButtons); i++) {
        var page = {
            title: i + 1,
            state: (i === currentPage ? 'active' : 'normal'),
            url: url + '?currentPage=' + i + endStuff
        };
        pages.push(page);
    }

    // Page forward one page
    pages.push({
        title: '>',
        state: (currentPage >= lastPage ? 'disabled' : 'normal'),
        url: url + '?currentPage=' + (currentPage + 1) + endStuff
    });

    // Last page
    if (options.showEndButtons) {
        pages.push({
            title: '>>',
            state: (startPage + options.numNavButtons >= lastPage ? 'disabled' : 'normal'),
            url: url + '?currentPage=' + lastPage + endStuff
        });
    }

    return pages;
}