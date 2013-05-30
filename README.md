## Ember AutoResize

Ember AutoResize is a mixin for providing autoresize functionality to `Ember.Views`. This package provides the necessary bootstrapping for `Ember.TextField` and `Ember.TextArea` for out-of-the-box usage. In addition to resizing, it provides a set of string measuring and metric calculators for elements provided under the `Ember.Metrics` namespace. The style of these functions are borrowed from SproutCore, but changed to work well with the breadth of styles that can be applied to Ember Views.

To enable autoresizing on an input, add the following to your handlebars:

```handlebars
{{view Ember.TextField autoresize=true}}
```

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

### Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates
