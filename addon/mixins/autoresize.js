import { getLayout, measureText } from "dom-ruler";
import Ember from "ember";

var get = Ember.get;
var set = Ember.set;
var scheduleOnce = Ember.run.scheduleOnce;
var once = Ember.run.once;
var keys = Ember.keys;
var isEmpty = Ember.isEmpty;
var alias = Ember.computed.alias;

/**
  This mixin provides common functionality for automatically
  resizing view depending on the contents of the view. To
  make your view resize, you need to set the `autoresize`
  property to `true`, and let the mixin know whether it
  can resize the height of width.

  In addition, `autoResizeText` is a required property for
  this mixin. It is already provided for `Ember.TextField` and
  `Ember.TextArea`.

  @class AutoResize
  @extends Ember.Mixin
  @since Ember 1.0.0-rc3
 */
var AutoResize = Ember.Mixin.create(/** @scope AutoResize.prototype */{

  /**
    Add `ember-auto-resize` so additional
    styling can be applied indicating that
    the text field will automatically resize.

    @property classNameBindings
   */
  classNameBindings: ['autoresize:ember-auto-resize'],

  /**
    Whether the view using this mixin should
    autoresize it's contents. To enable autoresizing
    using the view's default resizing, set
    the attribute in your template.

    ```handlebars
    {{input autoresize=true}}
    ```

    @property autoresize
    @type Boolean
    @default false
   */
  autoresize: false,

  /**
    The current dimensions of the view being
    resized in terms of an object hash that
    includes a `width` and `height` property.

    @property dimensions
    @default null
    @type Object
   */
  dimensions: null,

  /**
    Whether the auto resize mixin should resize
    the width of this view.

    @property shouldResizeWidth
    @default false
    @type Boolean
   */
  shouldResizeWidth: false,

  /**
    Whether the auto resize mixin should resize
    the height of this view.

    @property shouldResizeHeight
    @default false
    @type Boolean
   */
  shouldResizeHeight: false,

  /**
    If set, this property will dictate how much
    the view is allowed to resize horizontally
    until it either falls back to scrolling or
    resizing vertically.

    @property maxWidth
    @default null
    @type Number
   */
  maxWidth: alias('max-width'),

  /**
    If set, this property dictates how much
    the view is allowed to resize vertically.
    If this is not set and the view is allowed
    to resize vertically, it will do so infinitely.

    @property maxHeight
    @default null
    @type Number
   */
  maxHeight: alias('max-width'),

  /**
    A required property that should alias the
    property that should trigger recalculating
    the dimensions of the view.

    @property autoResizeText
    @required
    @type String
   */
  autoResizeText: Ember.required(),

  /**
    Whether the autoResizeText has been sanitized
    and should be treated as HTML.

    @property ignoreEscape
    @default false
    @type Boolean
   */
  ignoreEscape: false,

  /**
    Whether whitespace should be treated as significant
    contrary to any styles on the view.

    @property significantWhitespace
    @default false
    @type Boolean
   */
  significantWhitespace: false,

  /**
    Schedule measuring the view's size.
    This happens automatically when the
    `autoResizeText` property changes.

    @method scheduleMeasurement
   */
  scheduleMeasurement: Ember.observer('autoResizeText', function () {
    if (get(this, 'autoresize')) {
      once(this, 'measureSize');
    }
  }).on('init'),

  /**
    Measures the size of the text of the element.

    @method measureSize
   */
  measureSize: function () {
    var text = get(this, 'autoResizeText');
    var size;

    if (!isEmpty(text) && !get(this, 'isDestroying')) {
      // Provide extra styles that will restrict
      // width / height growth
      var styles  = {};
      var element = get(this, 'element');

      if (get(this, 'shouldResizeWidth')) {
        if (get(this, 'maxWidth') != null) {
          styles.maxWidth = get(this, 'maxWidth') + "px";
        }
      } else {
        styles.maxWidth = getLayout(element).width + "px";
      }

      if (get(this, 'shouldResizeHeight')) {
        if (get(this, 'maxHeight') != null) {
          styles.maxHeight = get(this, 'maxHeight') + "px";
        }
      } else {
        styles.maxHeight = getLayout(element).height + "px";
      }

      var measureRows = function (rows) {
        var html = '';
        for (var i = 0, len = parseInt(rows, 10); i < len; i++) {
          html += '<br>';
        }
        return measureText(html, styles, { template: element, escape: false }).height;
      };

      // Handle 'rows' attribute on <textarea>s
      if (get(this, 'rows')) {
        styles.minHeight = measureRows(get(this, 'rows')) + 'px';
      }

      // Handle 'max-rows' attribute on <textarea>s
      if (get(this, 'max-rows') && get(this, 'maxHeight') == null) {
        set(this, 'maxHeight', measureRows(get(this, 'rows')));
      }

      // Force white-space to pre-wrap to make
      // whitespace significant
      if (get(this, 'significantWhitespace')) {
        styles.whiteSpace = 'pre-wrap';
      }

      size = measureText(text, styles, { template: element, escape: !get(this, 'ignoreEscape') });
    } else {
      size = { width: 0, height: 0 };
    }

    set(this, 'measuredSize', size);
  },

  /**
    Alter the `dimensions` property of the
    view to conform to the measured size of
    the view.

    @method measuredSizeDidChange
   */
  measuredSizeDidChange: Ember.observer('measuredSize', function () {
    var size      = get(this, 'measuredSize');
    var maxWidth  = get(this, 'maxWidth');
    var maxHeight = get(this, 'maxHeight');
    var layoutDidChange = false;
    var dimensions = {};

    if (size == null) { return; }

    if (get(this, 'shouldResizeWidth')) {
      // Account for off-by-one error in FireFox
      // (specifically, input elements have 1px
      //  of scroll when this isn't applied)
      // TODO: sniff for this bug and fix it!
      size.width += 1;

      if (maxWidth != null &&
          size.width > maxWidth) {
        dimensions.width = maxWidth;
      } else {
        dimensions.width = size.width;
      }
      layoutDidChange = true;
    }

    if (get(this, 'shouldResizeHeight')) {
      if (maxHeight != null &&
          size.height > maxHeight) {
        dimensions.height = maxHeight;
      } else {
        dimensions.height = size.height;
      }
      layoutDidChange = true;
    }

    set(this, 'dimensions', dimensions);

    if (layoutDidChange) {
      scheduleOnce('render', this, 'dimensionsDidChange');
    }
  }).on('didInsertElement'),

  /**
    Retiles the view at the end of the render queue.
    @method dimensionsDidChange
   */
  dimensionsDidChange: function () {
    var dimensions = get(this, 'dimensions');
    var styles = {};

    keys(dimensions).forEach(function (key) {
      styles[key] = dimensions[key] + 'px';
    });

    if (get(this, 'maxHeight') == null) {
      styles.overflow = 'hidden';
    }

    var $element = this.$();
    if ($element) {
      $element.css(styles);
    }
  }

});

export default AutoResize;
