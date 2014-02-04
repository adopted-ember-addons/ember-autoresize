require('ember-autoresize/system/string_measurement');

/**
  This mixin provides common functionality for automatically
  resizing view depending on the contents of the view. To
  make your view resize, you need to set the `autoresize`
  property to `true`, and let the mixin know whether it
  can resize the height of width.

  In addition, `autoResizeText` is a required property for
  this mixin. It is already provided for `Em.TextField` and
  `Em.TextArea`.

  @class AutoResize
  @namespace Ember
  @extends Ember.Mixin
  @since Ember 1.0.0-rc3
 */
Ember.AutoResize = Ember.Mixin.create(/** @scope Ember.AutoResize.prototype */{

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
    {{view Ember.TextField autoresize=true}}
    ```

    @property autoresize
    @type Boolean
    @default false
   */
  autoresize: false,

  /**
    When the auto resize mixin is activated,
    trigger an initial measurement, which
    should layout the text fields properly.

    @private
   */
  init: function () {
    this._super();
    if (this.get('autoresize')) {
      this.scheduleMeasurement();
    }
  },

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
  maxWidth: null,

  /**
    If set, this property dictates how much
    the view is allowed to resize vertically.
    If this is not set and the view is allowed
    to resize vertically, it will do so infinitely.

    @property maxHeight
    @default null
    @type Number
   */
  maxHeight: null,

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
  scheduleMeasurement: Ember.observer('autoresizeText', function () {
    if (this.get('autoresize')) {
      Ember.run.once(this, 'measureSize');
    }
  }),

  /**
    Measures the size of the text of the element.

    @method measureSize
   */
  measureSize: function () {
    var text = this.get('autoResizeText'),
        size;

    if (!Ember.isEmpty(text) && !this.get('isDestroying')) {
      // Provide extra styles that will restrict
      // width / height growth
      var styles  = {},
          element = this.$()[0];

      if (this.get('shouldResizeWidth')) {
        if (this.get('maxWidth') != null) {
          styles.maxWidth = this.get('maxWidth') + "px";
        }
      } else {
        styles.maxWidth = Ember.Metrics.layoutOf(element).width + "px";
      }

      if (this.get('shouldResizeHeight')) {
        if (this.get('maxHeight') != null) {
          styles.maxHeight = this.get('maxHeight') + "px";
        }
      } else {
        styles.maxHeight = Ember.Metrics.layoutOf(element).height + "px";
      }

      // Force white-space to pre-wrap to make
      // whitespace significant
      if (this.get('significantWhitespace')) {
        styles.whiteSpace = 'pre-wrap';
      }

      Ember.Metrics.prepareStringMeasurement(element, styles);
      size = Ember.Metrics.measureString(text, this.get('ignoreEscape'));
      Ember.Metrics.teardownStringMeasurement();
    } else {
      size = { width: 0, height: 0 };
    }

    this.set('measuredSize', size);
  },

  /**
    Alter the `dimensions` property of the
    view to conform to the measured size of
    the view.

    @method measuredSizeDidChange
   */
  measuredSizeDidChange: Ember.observer('measuredSize', function () {
    var size      = this.get('measuredSize'),
        maxWidth  = this.get('maxWidth'),
        maxHeight = this.get('maxHeight'),
        layoutDidChange = false,
        dimensions = {};

    if (this.get('shouldResizeWidth')) {
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

    if (this.get('shouldResizeHeight')) {
      if (maxHeight != null &&
          size.height > maxHeight) {
        dimensions.height = maxHeight;
      } else {
        dimensions.height = size.height;
      }
      layoutDidChange = true;
    }

    this.set('dimensions', dimensions);

    if (layoutDidChange) {
      Ember.run.scheduleOnce('render', this, this.dimensionsDidChange);
    }
  }),

  /**
    Retiles the view at the end of the render queue.
    @method dimensionsDidChange
   */
  dimensionsDidChange: function () {
    var dimensions = this.get('dimensions'),
        styles = {};

    for (var key in dimensions) {
      if (dimensions.hasOwnProperty(key) &&
          key != null) {
        styles[key] = dimensions[key] + 'px';
      }
    }

    var $element = this.$();
    if ($element) {
      $element.css(styles);
    }
  }

});


/**
  @namespace Ember
  @class TextField
 */
Ember.TextField.reopen(Ember.AutoResize, /** @scope Ember.TextField.prototype */{

  /**
    By default, text fields only
    resize their width.

    @property shouldResizeWidth
    @default true
    @type Boolean
   */
  shouldResizeWidth: true,

  /**
    Whitespace should be treated as significant
    for text fields.

    @property significantWhitespace
    @default true
    @type Boolean
   */
  significantWhitespace: true,

  /**
    This provides a single character
    so users can click into an empty
    text field without it being too small

    @property autoResizeText
    @type String
   */
  autoResizeText: Ember.computed('value', function () {
    var value = this.get('value');
    return Ember.isEmpty(value) ? '.' : value;
  })

});

/**
  @namespace Ember
  @class TextArea
 */
Ember.TextArea.reopen(Ember.AutoResize, /** @scope Ember.TextArea.prototype */{

  /**
    By default, textareas only resize
    their height.

    @property shouldResizeHeight
    @type Boolean
   */
  shouldResizeHeight: true,

  /**
    Whitespace should be treated as significant
    for text areas.

    @property significantWhitespace
    @default true
    @type Boolean
   */
  significantWhitespace: true,

  /**
    Optimistically resize the height
    of the textarea so when users reach
    the end of a line, they will be
    presented with space to begin typing.

    @property autoResizeText
    @type String
   */
  autoResizeText: Ember.computed('value', function () {
    var value = this.get('value');
    if (Ember.isNone(value)) {
      value = '';
    }
    return value + '@';
  })

});
