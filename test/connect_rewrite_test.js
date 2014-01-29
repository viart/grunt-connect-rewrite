'use strict';

var utils = require('../lib/utils'),
    res = {
        statusCode: 0,
        headers: {},
        wasEnded: 0,
        setHeader: function (key, value) {
            this.headers[key] = value;
        },
        end: function () {
            this.wasEnded++;
        },
        _reset: function () {
            this.wasEnded = 0;
            this.statusCode = 0;
            this.headers = {};
        }
    };

exports.connect_rewrite = {
    setUp: function (done) {
        utils.resetRules();
        res._reset();
        done();
    },
    tearDown: function (done) {
        utils.resetRules();
        res._reset();
        done();
    },
    testWrongRuleRegistration: function (test) {
        test.expect(5);

        test.equal(utils.registerRule(), false);
        test.equal(utils.registerRule({}), false);
        test.equal(utils.registerRule({from: '  '}), false);
        test.equal(utils.registerRule({to: ' '}), false);
        test.equal(utils.rules().length, 0);

        test.done();
    },
    testCorrectRuleRegistration: function (test) {
        test.expect(3);

        test.equal(utils.registerRule({from: '', to: ''}), false);
        test.equal(utils.registerRule({from: '/from', to: '/to'}), 'REWRITE: /from -> /to');
        test.equal(utils.rules().length, 1);

        test.done();
    },
    testWithoutRules: function (test) {
        var _d = utils.dispatcher,
            wasCompleted = 0,
            wasDispached = 0;

        test.expect(2);

        utils.dispatcher = function () { wasDispached++; };

        utils.rewriteRequest({url: '/'}, null, function () { wasCompleted ++; });
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');
        test.equal(wasDispached, 0, 'Should not try to dispatch without RewriteRules.');

        utils.dispatcher = _d;

        test.done();
    },
    testInternalRule: function (test) {
        var req = {},
            wasCompleted = 0;

        test.expect(12);

        test.equal(
            utils.registerRule({from: '^/fr[o0]m-([^-]+)-(\\d+)\\.html$', to: '/to-$1-$2.html'}),
            'REWRITE: ^/fr[o0]m-([^-]+)-(\\d+)\\.html$ -> /to-$1-$2.html'
        );
        test.equal(utils.rules().length, 1);

        req.url = '/fr0m-s0me-123.html';
        utils.rewriteRequest(req, res, function () { wasCompleted ++; });
        test.equal(req.url, '/to-s0me-123.html', 'Should change matched URI.');
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');
        test.equal(res.statusCode, 0, 'Should not change HTTP Status Code.');
        test.same(res.headers, {}, 'Should not change Headers.');
        test.equal(res.wasEnded, 0, 'Response should not be ended.');

        req.url = '/error-case.html';
        wasCompleted = 0;
        res._reset();
        utils.rewriteRequest(req, res, function () { wasCompleted++; });
        test.equal(req.url, '/error-case.html', 'Should not change not matched URI.');
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');
        test.equal(res.statusCode, 0, 'Should not change HTTP Status Code.');
        test.same(res.headers, {}, 'Should not change Headers.');
        test.equal(res.wasEnded, 0, 'Response should not be ended.');

        test.done();
    },
    testBrowserRule: function (test) {
        var req = {},
            wasCompleted = 0;

        test.expect(12);

        test.equal(
            utils.registerRule({from: '^/fr[o0]m-([^-]+)-(\\d+)\\.html$', to: '/to-$1-$2.html', redirect: 'permanent'}),
            'REDIRECT 301: ^/fr[o0]m-([^-]+)-(\\d+)\\.html$ -> /to-$1-$2.html'
        );
        test.equal(utils.rules().length, 1);

        req.url = '/fr0m-s0me-123.html';
        utils.rewriteRequest(req, res, function () { wasCompleted ++; });
        test.equal(wasCompleted, 0, 'Should block Connect middleware.');
        test.equal(req.url, '/fr0m-s0me-123.html', 'Should not change matched URI.');
        test.equal(res.statusCode, 301, 'Should change HTTP Status Code.');
        test.same(res.headers, {'Location': '/to-s0me-123.html'}, 'Should add the `Location` Header.');
        test.equal(res.wasEnded, 1, 'Response should be ended.');

        req.url = '/error-case.html';
        wasCompleted = 0;
        res._reset();
        utils.rewriteRequest(req, res, function () { wasCompleted++; });
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');
        test.equal(req.url, '/error-case.html', 'Should not change not matched URI.');
        test.equal(res.statusCode, 0, 'Should not change HTTP Status Code.');
        test.same(res.headers, {}, 'Should not change Headers.');
        test.equal(res.wasEnded, 0, 'Response should not be ended.');

        test.done();
    },
    testLogging: function (test) {
        var req = {},
            wasCalled = 0;

        utils.log = {
            verbose: {
                writeln: function () {
                    wasCalled++;
                }
            }
        };

        test.expect(1);

        utils.registerRule({from: '^/fr[o0]m-([^-]+)-(\\d+)\\.html$', to: '/to-$1-$2.html'});

        req.url = '/fr0m-s0me-123.html';
        utils.rewriteRequest(req, res, function () { });

        req.url = '/error-case.html';
        utils.rewriteRequest(req, res, function () { });

        test.equal(wasCalled, 1);

        test.done();
    }
};
