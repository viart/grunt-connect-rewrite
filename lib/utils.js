/*
 * grunt-connect-rewrite
 * https://github.com/viart/grunt-connect-rewrite
 *
 * Copyright (c) 2013 Artem Vitiuk
 * Licensed under the MIT license.
 */

'use strict';

var utils = module.exports,
    rules = [];

utils.registerRule = function (rule) {

    if (!rule || !rule.from || !rule.to ||
        !(rule.from = rule.from.trim()) ||
        !(rule.to = rule.to.trim())) {
        return false;
    }

    if (rule.redirect) {
        rule.redirect = rule.redirect === 'permanent' ? 301 : 302;
    }

    rules.push({
        from: new RegExp(rule.from),
        to: rule.to,
        redirect: rule.redirect
    });

    return (rule.redirect ? 'redirect ' + rule.redirect: 'rewrite').toUpperCase() + ': ' + rule.from + ' -> ' + rule.to;
};

utils.resetRules = function () {
    rules = [];
};

utils.rules = function () {
    return rules;
};

utils.dispatcher = function (req, res, next) {
    return function (rule) {
        var toUrl;
        if (rule.from.test(req.url)) {
            toUrl = req.url.replace(rule.from, rule.to);
            if (utils.debugging) {
                utils.log.ok('Request ' + req.url + ' matched rule ' + rule.from + '. Rewrote to ' + toUrl);
            }
            if (!rule.redirect) {
                req.url = toUrl;
                next();
            } else {
                res.statusCode = rule.redirect;
                res.setHeader('Location', toUrl);
                res.end();
            }
            return true;
        }
    };
};

utils.rewriteRequest = function (req, res, next) {
    if (!rules.length || !rules.some(utils.dispatcher(req, res, next))) {
        next();
    }
};
