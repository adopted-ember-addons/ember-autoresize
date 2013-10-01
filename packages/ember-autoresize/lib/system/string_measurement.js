var metricsCalculationElement = null,
    // A list of all of the style properties
    // to copy over to our example element
    layoutStyles = [
      'maxWidth',
      'maxHeight',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom',
      'borderLeftStyle',
      'borderRightStyle',
      'borderTopStyle',
      'borderBottomStyle',
      'borderLeftWidth',
      'borderRightWidth',
      'borderTopWidth',
      'borderBottomWidth',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontVariant',
      'lineHeight',
      'whiteSpace',
      'letterSpacing',
      'wordWrap',
      'boxSizing',
      'MozBoxSizing',
      'textTransform',
      'textRendering',
      // Font feature settings
      'webkitFontFeatureSettings',
      'mozFontFeatureSettings',
      'msFontFeatureSettings',
      'oFontFeatureSettings',
      'fontFeatureSettings'
    ],
    defaultBoxSizing;

/**
  Return the computed styles for a given element.

  TODO: Cache the last used element's computed style
        properties so they don't have to be fetched again.

  @private
 */
function computedStylesFor(element) {
  // Retrieve the computed style of the element
  var styles;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    styles = document.defaultView.getComputedStyle(element, null);
  } else {
    styles = element.currentStyle;
  }

  return styles;
};

/**
  Detect the browser's default box sizing.
  This should detect old IE quirks and then
  provide the correct box model when detecting
  per-element box-sizing.

  @private
 */
var detectDefaultBoxSizing = function () {
  var tester    = document.createElement('div'),
      boxSizing;

  document.body.appendChild(tester);
  tester.style.cssText = 'width:24px; padding:10px; border:2px solid #000;' +
                         'box-sizing:content-box; -moz-box-sizing:content-box;';

  switch (tester.offsetWidth) {
  case 24:
    boxSizing = 'border-box';
    break;
  case 44:
    boxSizing = 'padding-box';
    break;
  case 48:
    boxSizing = 'content-box';
    break;
  }

  document.body.removeChild(tester);
  return boxSizing;
};

/**
  @private
  @return {String} The box sizing of the current element
 */
var boxSizingOf = function (element) {
  // Detect the browser's default box sizing model
  if (defaultBoxSizing == null) {
    defaultBoxSizing = detectDefaultBoxSizing();
  }

  var styles = computedStylesFor(element);
  return styles.boxSizing       ||
         styles.webkitBoxSizing ||
         styles.MozBoxSizing    ||
         styles.msBoxSizing     ||
         styles.oBoxSizing      ||
         defaultBoxSizing;
};

/**
  @private
  @returns {Number|String} Returns a normalized margin so it's a number or 'auto'.
 */
var normalizeMargin = function (margin) {
  if (margin !== 'auto') {
    return parseInt(margin, 10);
  }
  return margin;
};

/**
  Computes the layout of an element that matches
  the inspector properties of the DOM element.

  @method layoutOf
  @for Ember.Metrics
  @static
  @param element {DOMELement} The element to compute the layout of.
  @return {Object} Layout properties of the element
 */
function layoutOf(element) {
  // Handle window
  if (element instanceof Window) {
    var dimensions = {
          width:  element.innerWidth,
          height: element.innerHeight
        },
        dimensionsWithChrome = {
          width:  element.outerWidth,
          height: element.outerHeight
        };

    // IE<8 doesn't support window.innerWidth / window.outerWidth

    return {
      width:     element.innerWidth,
      height:    element.innerHeight,
      boxSizing: null,
      content: dimensions,
      borders: dimensions,
      margins: dimensionsWithChrome
    };
  }

  // Handle document
  if ((window.Document && element instanceof Document) || // Standards
      element === document) {                             // old IE
    var dimensions = {
      width:  Math.max(
        element.body.scrollWidth, element.documentElement.scrollWidth,
        element.body.offsetWidth, element.documentElement.offsetWidth,
        element.body.clientWidth, element.documentElement.clientWidth
      ),
      height: Math.max(
        element.body.scrollHeight, element.documentElement.scrollHeight,
        element.body.offsetHeight, element.documentElement.offsetHeight,
        element.body.clientHeight, element.documentElement.clientHeight
      )
    };

    // The document has no chrome
    return {
      width:    dimensions.width,
      height:   dimensions.height,
      boxSizing: null,
      content: dimensions,
      borders: dimensions,
      margins: dimensions
    };
  }

  var boxSizing = boxSizingOf(element),
      content = {
        width:  element.offsetWidth,
        height: element.offsetHeight
      },
      styles = computedStylesFor(element),
      layout = {
        width:     null,
        height:    null,
        boxSizing: boxSizing,
        content:   {},
        padding:   {},
        borders:   {},
        margins:   {}
      },
      padding = {
        top:    parseInt(styles.paddingTop,        10),
        right:  parseInt(styles.paddingRight,      10),
        bottom: parseInt(styles.paddingBottom,     10),
        left:   parseInt(styles.paddingLeft,       10)
      },
      borders = {
        top:    parseInt(styles.borderTopWidth,    10),
        right:  parseInt(styles.borderRightWidth,  10),
        bottom: parseInt(styles.borderBottomWidth, 10),
        left:   parseInt(styles.borderLeftWidth,   10)
      },
      margins = {
        top:    normalizeMargin(styles.marginTop),
        right:  normalizeMargin(styles.marginRight),
        bottom: normalizeMargin(styles.marginBottom),
        left:   normalizeMargin(styles.marginLeft)
      };

  // Normalize the width and height so
  // they refer to the content
  content.width  -= borders.right + borders.left +
                    padding.right + padding.left;
  content.height -= borders.top + borders.bottom +
                    padding.top + padding.bottom;
  layout.content = content;

  padding.width  = content.width +
                   padding.left + padding.right;
  padding.height = content.height +
                   padding.top + padding.bottom;
  layout.padding = padding;

  borders.width  = padding.width +
                   borders.left + borders.right;
  borders.height = padding.height +
                   borders.top + borders.bottom;
  layout.borders = borders;

  // Provide the "true" width and height
  // of the box in terms of the current box model
  switch (boxSizing) {
  case 'border-box':
    layout.width  = borders.width;
    layout.height = borders.height;
    break;
  case 'padding-box':
    layout.width  = padding.width;
    layout.height = padding.height;
    break;
  default:
    layout.width  = content.width;
    layout.height = content.height;
  }

  if (margins.left !== 'auto' && margins.right !== 'auto') {
    margins.width = borders.width +
                    margins.left + margins.right;
  } else {
    margins.width = 'auto';
  }

  if (margins.top !== 'auto' && margins.bottom !== 'auto') {
    margins.height = borders.height +
                     margins.top + margins.bottom;
  } else {
    margins.height = 'auto';
  }
  layout.margins = margins;

  return layout;
};

/**
  Prepare for measuring the layout of a string.

  @method prepareStringMeasurement
  @for Ember.Metrics
  @static
  @param exampleElement {DOMElement}
    A DOM element to use as a template for measuring a string in.
  @param additionalStyles {Object}
    Additional styles to apply to the calculation element.
 */
function prepareStringMeasurement(exampleElement, additionalStyles) {
  var element = metricsCalculationElement;

  if (additionalStyles == null) {
    additionalStyles = {};
  }

  if (metricsCalculationElement == null) {
    var parent = document.createElement('div');
    parent.style.cssText = "position:absolute; left:-10010px; top:-10px;" +
                           "width:10000px; height:0px; overflow:hidden;" +
                           "visibility:hidden;";

    element = metricsCalculationElement = document.createElement('div');

    parent.appendChild(metricsCalculationElement);
    document.body.insertBefore(parent, null);
  }

  // Retrieve the computed style of the element
  var styles = computedStylesFor(exampleElement);

  // Iterate through the styles that we care about for layout
  // and apply them to the element
  for (var i = 0, len = layoutStyles.length; i < len; i++) {
    var style = layoutStyles[i],
        value = styles[style];
    element.style[style] = value;
  }

  // Explicitly set the `font` property for Mozilla
  var font = "";
  if (styles.font === "") {
    if (styles.fontStyle)   font += styles.fontStyle   + " ";
    if (styles.fontVariant) font += styles.fontVariant + " ";
    if (styles.fontWeight)  font += styles.fontWeight  + " ";
    if (styles.fontSize)    font += styles.fontSize    + " ";
    else                    font += "10px";
    if (styles.lineHeight)  font += "/" + styles.lineHeight;

    font += " ";
    if (styles.fontFamily)  font += styles.fontFamily;
    else                    font += "sans-serif";

    element.style.font = font;
  }

  Ember.mixin(element.style, {
    position: "absolute",
    top:    "0px",
    right:  "auto",
    bottom: "auto",
    left:   "0px",
    width:  "auto",
    height: "auto"
  }, additionalStyles);
};

/**
  Cleanup properties used by `measureString`
  setup in `prepareStringMeasurement`.

  @for Ember.Metrics
  @static
  @method teardownStringMeasurement
 */
function teardownStringMeasurement() {
  // Remove any leftover styling from string measurements
  if (metricsCalculationElement) {
    metricsCalculationElement.innerHTML = "";
    metricsCalculationElement.className = "";
    metricsCalculationElement.setAttribute('style', '');
  }
};

/**
  Measures a string given the styles applied
  when setting up string measurements.

  @for Ember.Metrics
  @static
  @method measureString
  @param string {String} The string to measure
  @param ignoreEscape {Boolean} Whether the string should be escaped.
  @return {Object} The layout of the string passed in.
 */
function measureString(string, ignoreEscape) {
  var element = metricsCalculationElement;

  if (ignoreEscape) {
    element.innerHTML = string;

  // Escape the string by entering it as
  // a text node to the DOM element
  } else if (Ember.typeOf(element.innerText) !== "undefined") {
    element.innerText = string;
  } else {
    element.textContent = string;
  }

  // Trigger a repaint so the height and width are correct
  // Webkit / Blink needs this to trigger a reflow
  element.style.overflow = 'visible';
  element.style.overflow = 'hidden';

  return layoutOf(element);
};

Ember.Metrics = {
  prepareStringMeasurement:  prepareStringMeasurement,
  teardownStringMeasurement: teardownStringMeasurement,
  measureString:             measureString,
  layoutOf:                  layoutOf
};
