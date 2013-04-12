# grunt-connect-rewrite

> This plugin provides RewriteRules middleware for the Grunt Connect.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-connect-rewrite --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-connect-rewrite');
```

## Adapting the "connect" task

### Overview

#### Rules Configuration
In your project's Gruntfile, add a section named `rules` to your existing connect definition.

```js
grunt.initConfig({
    connect: {
        options: {
            port: 9000,
            hostname: 'localhost'
        },
        rules: {
            '^/index_dev.html$': '/src/index.html',
            '^/js/(.*)$': '/src/js/$1',
            '^/css/(.*)$': '/public/css/$1'
        }
    }
})
```

#### Adding the middleware
Include helper to use in the middleware (add this line to the top of the grunt file):
```js
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
```

Add the RewriteRules snippet to the connect option middleware hook
```js
connect: {
    development: {
        options: {
            middleware: function (connect) {
                return [
                    rewriteRulesSnippet
                ];
            }
        }
    }
}
```

### Adding the "configureRewriteRules" task to the server task
For the server task, add the "configureRewriteRules" task before the "connect" task
```js
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
0.1.0 Initial Release
