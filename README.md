## Ember AutoResize [![Ember Observer Score](http://emberobserver.com/badges/ember-autoresize.svg)](http://emberobserver.com/addons/ember-autoresize) [![Code Climate](https://codeclimate.com/github/paddle8/ember-autoresize/badges/gpa.svg)](https://codeclimate.com/github/paddle8/ember-autoresize)

Ember AutoResize is an ember-cli addon for providing autoresize functionality to Ember. This package provides the necessary bootstrapping for `{{input}}` and `{{textarea}}` components.

To enable autoresizing on an input, add the following to your handlebars:

```handlebars
{{input autoresize=true}}
```

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

To play with the mixin, look at our [demo](http://paddle8.github.io/ember-autoresize).

### Options

 Attribute  | Description
-----------:|-----------------------------------------
 max-width  | The max width of the resizeable element
 max-height | The max height of the resizeable element
 rows       | The minimum number of rows for an element (best used for textarea elements)
 max-rows   | The maximum number of rows for an element (best used for textarea elements)

### Installation

```bash
npm install --save-dev ember-autoresize
ember g ember-autoresize
```

### Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates
