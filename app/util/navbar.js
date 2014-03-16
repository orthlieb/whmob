'use strict';

exports.generatePaginatorData = function Paginate(url, numSites, currentPage, viewLimit) {
    // Set up data structure used by the paginator.
    var pages = [];

    var lastPage = Math.ceil(numSites / viewLimit);

    // Go to beginning.
    pages.push({
        title: '<<',
        state: (currentPage === 0 ? 'disabled' : 'normal'),
        url: url + '&currentPage=0&viewLimit=' + viewLimit
    });

    // Page backward
    pages.push({
        title: '<',
        state: (currentPage === 0 ? 'disabled' : 'normal'),
        url: url + '&currentPage=0&viewLimit=' + viewLimit
    });

    // Middle pages
    for (var i = 0; i < lastPage; i++) {
        var page = {
            title: i + 1,
            state: (i === currentPage ? 'active' : 'normal'),
            url: url + '&currentPage=' + i + '&viewLimit=' + viewLimit
        };
        pages.push(page);
    }

    // Page forward
    pages.push({
        title: '>',
        state: (currentPage === lastPage ? 'disabled' : 'normal'),
        url: url + '&currentPage=' + (currentPage + 1) + '&viewLimit=' + viewLimit
    });

    // Last page
    pages.push({
        title: '>>',
        state: (currentPage === lastPage ? 'disabled' : 'normal'),
        url: url + '&currentPage=' + lastPage + '&viewLimit=' + viewLimit
    });

    return pages;
}