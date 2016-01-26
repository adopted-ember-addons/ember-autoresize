# Ember AutoResize [![Ember Observer Score](http://emberobserver.com/badges/ember-autoresize.svg)](http://emberobserver.com/addons/ember-autoresize) [![Code Climate](https://codeclimate.com/github/tim-evans/ember-autoresize/badges/gpa.svg)](https://codeclimate.com/github/tim-evans/ember-autoresize)

**Note: if you're using a version of Ember less than `1.12.0`, then please use `0.4.1` of this addon.**

Ember AutoResize is an Ember-CLI addon for providing autoresize functionality to Ember. This package currently provides the necessary bootstrapping for `{{input}}` and `{{textarea}}` components.

To play with the addon, look at our [demo](http://tim-evans.github.io/ember-autoresize). (Note: The demo is a bit out of date, check the documentation below for proper usage.)

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
```

## Roadmap
- Optimize style lookups
- Font fitting
- Clearer ways to enable autoresizing on templates

# Contributing

Contributors are welcome! Please provide a reproducible test case. Details will be worked out on a case-per-case basis. Maintainers will get in touch when they can, so delays are possible. For contribution guidelines, see the [code of conduct](https://github.com/tim-evans/ember-plupload/blob/master/CONDUCT.md).

### Publishing Documentation

To publish documentation (under the tests/dummy directory) run the following command:

```bash
npm run-script publish-docs
```
