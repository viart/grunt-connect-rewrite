/*
 * grunt-connect-rewrite
 * https://github.com/viart/grunt-connect-rewrite
 *
 * Copyright (c) 2013 Artem Vitiuk
 * Licensed under the MIT license.
 */

'use strict';

var utils = require('../lib/utils');

module.exports = function (grunt) {
    grunt.registerTask('configureRewriteRules', 'Configure connect rewriting rules.', function () {
        var options = this.options({
            rulesProvider: 'connect.rules'
        });
        var rules = grunt.config(options.rulesProvider) || {};
        Object.keys(rules).forEach(function (from) {
            var to = rules[from];
            if (utils.registerRule({from: from, to: to})) {
                grunt.log.ok('Rewrite rule created for: [' + from + ' -> ' + to + '].');
            } else {
                grunt.log.error('Wrong rule given.');
            }
        });
    });
};
