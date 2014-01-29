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
        utils.log = grunt.log;
        (grunt.config(options.rulesProvider) || []).forEach(function (rule) {
            rule = rule || {};
            var registeredRule = utils.registerRule({from: rule.from, to: rule.to, redirect: rule.redirect});
            if (registeredRule) {
                grunt.log.ok('Rewrite rule created for: [' + registeredRule + '].');
            } else {
                grunt.log.error('Wrong rule given.');
            }
        });
    });
};
