'use strict';

var utils = require('../lib/utils');

exports.connect_rewrite = {
    setUp: function (done) {
        utils.resetRules();
        done();
    },
    tearDown: function (done) {
        utils.resetRules();
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
        test.equal(utils.registerRule({from: '/from', to: '/to'}), true);
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
    testRegExpRule: function (test) {
        var req = {},
            wasCompleted = 0;

        test.expect(6);

        test.equal(utils.registerRule({from: '^/fr[o0]m-([^-]+)-(\\d+)\\.html$', to: '/to-$1-$2.html'}), true);
        test.equal(utils.rules().length, 1);

        req.url = '/fr0m-s0me-123.html';
        utils.rewriteRequest(req, null, function () { wasCompleted ++; });
        test.equal(req.url, '/to-s0me-123.html', 'Should change matched URI.');
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');

        req.url = '/error-case.html';
        wasCompleted = 0;
        utils.rewriteRequest(req, null, function () { wasCompleted++; });
        test.equal(req.url, '/error-case.html', 'Should not change not matched URI.');
        test.equal(wasCompleted, 1, 'Should not block Connect middleware.');

        test.done();
    }
};
