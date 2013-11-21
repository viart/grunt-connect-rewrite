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
        !(rule.from = rule.from.trim())) {
        return false;
    }

    rules.push({
        from: new RegExp(rule.from),
        to: rule.to
    });

    return true;
};

utils.resetRules = function () {
    rules = [];
};

utils.rules = function () {
    return rules;
};

utils.dispatcher = function (req) {
    return function (rule) {
        if (rule.from.test(req.url)) {
            req.url = req.url.replace(rule.from, rule.to);
            return true;
        }
    };
};

utils.rewriteRequest = function (req, res, next) {
    if (rules.length) {
        rules.some(utils.dispatcher(req));
    }
    next();
};

utils.redirectRequest = function (req, res, next) {
    if (rules.length && rules.some(utils.dispatcher(req))) {
        res.writeHead(302, {'Location': req.url});
        res.end();
    } else {
        next();
    }
}
