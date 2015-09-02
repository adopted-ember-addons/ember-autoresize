/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'eot', 'ttf', 'woff', 'woff2', 'svg'],
      prepend: '/ember-autoresize/'
    },
    snippetSearchPaths: ['tests/dummy/app'],
    snippetPaths: ['tests/dummy/snippets'],
    svg: {
      paths: [
        'tests/dummy/public/assets/images'
      ]
    }
  });

  app.import('bower_components/handlebars/handlebars.amd.js', {
    exports: {
      'handlebars': [
        'default'
      ]
    }
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
