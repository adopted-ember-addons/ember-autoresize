# Usage

To enable autoresizing on an input, add the following to your handlebars:

{{#docs-demo as |demo|}}
  {{#demo.example name='input.hbs'}}
    {{input autoresize=true}}
  {{/demo.example}}
  {{demo.snippet 'input.hbs'}}
{{/docs-demo}}

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

Textareas work exactly the same way:

{{#docs-demo as |demo|}}
  {{#demo.example name='textarea.hbs'}}
    {{textarea autoresize=true}}
  {{/demo.example}}
  {{demo.snippet 'textarea.hbs'}}
{{/docs-demo}}


## Options

**max-width**
Set the maximum width of the resizeable element. If no unit is provided, it assumes that it's in pixels. Test it below!

{{#docs-demo as |demo|}}
  {{#demo.example name='max-width.hbs'}}
    <div class="columns">
      {{input autoresize=true max-width=maxWidth}}
      {{text-ruler max-width=maxWidth}}
    </div>
  {{/demo.example}}
  {{demo.snippet 'max-width.hbs'}}
{{/docs-demo}}


**max-height**

Set the maximum height of the resizeable element. If no unit is provided, it assumes that it's in pixels. Test it below!

{{#docs-demo as |demo|}}
  {{#demo.example name='max-height.hbs'}}
    <div class="rows">
      {{text-ruler max-height=maxHeight}}
      {{textarea autoresize=true max-height=maxHeight}}
    </div>
  {{/demo.example}}
  {{demo.snippet 'max-height.hbs'}}
{{/docs-demo}}

**rows**

Set the minimum number of rows for the element. Recommended for textareas.

{{#docs-demo as |demo|}}
  {{#demo.example name='rows.hbs'}}
    {{textarea autoresize=true rows=2}}
  {{/demo.example}}
  {{demo.snippet 'rows.hbs'}}
{{/docs-demo}}

**max-rows**

Set the maximum number of rows for the element. Recommended for textareas.

{{#docs-demo as |demo|}}
  {{#demo.example name='max-rows.hbs'}}
    {{textarea autoresize=true max-rows=10}}
  {{/demo.example}}
  {{demo.snippet 'max-rows.hbs'}}
{{/docs-demo}}

## Customizing

If you are making custom inputs using raw DOM elements, you can still use autoresize by specifying a custom autoresizeElement when you mixin the autoresize to your component.

```js
import Ember from 'ember';

export default Ember.Component.extend({
  autoresizeElementDidChange: on('didInsertElement', function () {
    set(this, 'autoresizeElement', this.$('input')[0]);
  })
});
```