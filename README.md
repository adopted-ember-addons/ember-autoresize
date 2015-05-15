# Ember AutoResize [![Ember Observer Score](http://emberobserver.com/badges/ember-autoresize.svg)](http://emberobserver.com/addons/ember-autoresize) [![Code Climate](https://codeclimate.com/github/paddle8/ember-autoresize/badges/gpa.svg)](https://codeclimate.com/github/paddle8/ember-autoresize)

Ember AutoResize is an Ember-CLI addon for providing autoresize functionality to Ember. This package currently provides the necessary bootstrapping for `{{input}}` and `{{textarea}}` components.

To play with the addon, look at our [demo](http://paddle8.github.io/ember-autoresize). (Note: The demo is a bit out of date, check the documentation below for proper usage.)

## Usage

To enable autoresizing on an input, add the following to your handlebars:

```handlebars
{{input autoresize=true}}
```

Refresh your page, and you should see that when you type in your text field, it automatically resizes to fit the text.

Textareas work exactly the same way:

```handlebars
{{textarea autoresize=true}}
```

### Options

#### max-width

Set the maximum width of the resizeable element. If no unit is provided, it assumes that it's in pixels.

```handlebars
{{input autoresize=true max-width=200}}
```

#### max-height

Set the maximum width of the element. If no unit is provided, it assumes that it's in pixels.

```handlebars
{{input autoresize=true max-height=300}}
```

#### rows

Set the minimum number of rows for the element. Recommended for textareas.

```handlebars
{{textarea autoresize=true rows=2}}
```

#### max-rows

Set the maximum number of rows for the element.  Recommended for textareas.

```handlebars
{{textarea autoresize=true max-rows=10}}
```

## Installation

```bash
ember install ember-autoresize
ember g ember-autoresize
```

## Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates
