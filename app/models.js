/*
 * Models loader
 */

'use strict';

var fs = require('fs');

module.exports = function (app, passport, config) {
    // Load all models.
    var modelsDir = __dirname + '/models';
    try {
        fs.readdirSync(modelsDir).forEach(function (file) {
            if (file[0] === '.') {
                return;
            }
            console.log('Models: loading ' + file);
            require(models + '/' + file)(app, passport, config);
        });
    } catch (e) {
        console.log('Models: cannot load models');
    }
};