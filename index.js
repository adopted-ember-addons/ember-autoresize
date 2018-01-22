/* eslint-env node */
'use strict';
const VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-autoresize',

  included: function (app) {
    this._super.included.apply(this, arguments);
    let checker = new VersionChecker(this);

    checker.for('ember-cli').assertAbove('2.15.0', '`ember-cli` 2.15 or greater is required to use this version of ember-autoresize. Use ember-autoresize@0.6.1 if you\'re using an older version of ember-cli.');

    app.import('node_modules/dom-ruler/dist/amd/dom-ruler.js', {
      exports: {
        'dom-ruler': ['default']
      }
    });
  }
};
