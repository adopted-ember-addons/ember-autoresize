import Ember from "ember";
import AutoResize from "../mixins/autoresize";

var get = Ember.get;
var isEmpty = Ember.isEmpty;

/**
  @namespace Ember
  @class TextField
 */
Ember.TextField.reopen(AutoResize, /** @scope Ember.TextField.prototype */{

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
    var value = get(this, 'value');
    return isEmpty(value) ? '.' : value;
  })

});
