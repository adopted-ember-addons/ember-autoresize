/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-autoresize',
  options: {
    nodeAssets: {
      'dom-ruler': {
        srcDir: 'dist/amd',
        import: ['dom-ruler.js']
      }
    }
  },

  included: function (app) {
    this._super.included.apply(this, arguments);
    app.import('vendor/dom-ruler/dom-ruler.js', {
      exports: {
        'dom-ruler': ['default']
      }
    });
  }
};
