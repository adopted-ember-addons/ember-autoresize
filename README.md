## Ember AutoResize

Ember AutoResize is an ember-cli addon for providing autoresize functionality to Ember. This package provides the necessary bootstrapping for `{{input}}` and `{{textarea}}` components.

To enable autoresizing on an input, add the following to your handlebars:

```handlebars
{{input autoresize=true}}
```

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

To play with the mixin, look at our [demo](http://paddle8.github.io/ember-autoresize).

### Installation

```bash
npm install --save-dev ember-autoresize
ember g ember-autoresize
```

### Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates
