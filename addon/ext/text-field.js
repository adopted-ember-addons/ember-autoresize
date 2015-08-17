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

    If a placeholder is set,
    it will be used instead.

    @property autoResizeText
    @type String
   */
  autoResizeText: Ember.computed('value', 'placeholder', {
    get() {
      var placeholder = get(this, 'placeholder');
      var value = get(this, 'value');

      if (isEmpty(value)) {
        return isEmpty(placeholder) ? '.' : placeholder;
      }

      return value;
    }
  })
});
