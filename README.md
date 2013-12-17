# grunt-connect-rewrite v0.2.0 [![Build Status](https://travis-ci.org/viart/grunt-connect-rewrite.png?branch=master)](https://travis-ci.org/viart/grunt-connect-rewrite)

> This plugin provides RewriteRules middleware for the Grunt Connect / Express.
> Which could be used to redirect (rewrite internally or redirect using HTTP codes) User to the specific URL based on RegExp Rules.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-connect-rewrite --save-dev
```

### Options

##### Rule's format:

`{from: '__from__', to: '__to__'[, redirect: 'permanent'|'temporary']}`

Where:
* `__from__` - RegExp string to match.
* `__to__` - String that replaces matched URL.
* `redirect` - Optional parameter:
    * When it is omitted then the Rule will be dispatched as an internal rewrite (aka proxified).
    * If the value is set then Browser will receive HTTP `Location` Header with value of parsed `__to__` (`permanent` value will give `HTTP 301`, any other value will give `HTTP 302`).

##### rulesProvider
Type: `String`

Default value: `connect.rules`

You can specify grunt config section from which Rules will be read, like so:

```js
grunt.initConfig({
    express: {
        options: {
            port: 9000
        },
        server: {
            hostname: 'localhost'
        },
        rules: [
            // ... your rules here
        ]
    },
    configureRewriteRules: {
        options: {
            rulesProvider: 'express.rules'
        }
    }
})
```

### Example of usage
In your project's Gruntfile:
* Include the `rewriteRequest` snippet.
* Add a section named `rules` to your existing Connect or Express definition.
    **Please note:** unlike options, rules cannot be set per server, so the `rules` attribute must always be nested directly under `connect` or `express`.
* Add `configureRewriteRules` before the web server task.
* Don't forget to load the plugin (e.g. `grunt.loadNpmTasks('grunt-connect-rewrite')`).

```js
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
grunt.initConfig({
    connect: {
        options: {
            port: 9000,
            hostname: 'localhost'
        },
        rules: [
            // Internal rewrite
            {from: '^/index_dev.html$', to: '/src/index.html'},
            // Internal rewrite
            {from: '^/js/(.*)$', to: '/src/js/$1'},
            // 301 Redirect
            {from: '^/old-stuff/(.*)$', to: '/new-cool-stuff/$1', redirect: 'permanent'},
            // 302 Redirect
            {from: '^/stuff/(.*)$', to: '/temporary-stuff/$1', redirect: 'temporary'}
        ],
        development: {
            options: {
                middleware: function (connect, options) {
                    return [
                        rewriteRulesSnippet, // RewriteRules support
                        connect.static(require('path').resolve(options.base)) // mount filesystem
                        // ... any other middleware
                    ];
                }
            }
        }
    }
})

grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-connect-rewrite');

// "configureRewriteRules" should be before the "connect"/"express" task
grunt.registerTask('server', function (target) {
    grunt.task.run([
        'configureRewriteRules',
        'connect:development'
    ]);
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013.11.21 `v0.2.0` Add support for Browser's redirects (HTTP 301/302)
* 2013.07.27 `v0.1.1` Add possibility to read settings from custom grunt config path
* 2013.04.12 `v0.1.0` Initial Release

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/viart/grunt-connect-rewrite/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
