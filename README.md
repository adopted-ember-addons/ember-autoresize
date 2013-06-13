## Ember AutoResize

Ember AutoResize is a mixin for providing autoresize functionality to `Ember.Views`. This package provides the necessary bootstrapping for `Ember.TextField` and `Ember.TextArea` for out-of-the-box usage. In addition to resizing, it provides a set of string measuring and metric calculators for elements provided under the `Ember.Metrics` namespace. The style of these functions are borrowed from SproutCore, but changed to work well with the breadth of styles that can be applied to Ember Views.

To enable autoresizing on an input, add the following to your handlebars:

```handlebars
{{view Ember.TextField autoresize=true}}
```

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

To play with the mixin, look at our [demo](http://paddle8.github.io/ember-autoresize).

### Building

To build the library, clone the repository and run:

```bash
bundle
rake dist
```

The built files will be located in the `/dist` directory.

### Testing

To test the library, clone the repository and run:

```bash
bundle
rake test
```

### Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates
