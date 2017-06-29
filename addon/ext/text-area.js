import Ember from "ember";
import AutoResize from "../mixins/autoresize";

var get = Ember.get;
var isNone = Ember.isNone;

/**
  @element text-area
 */
Ember.TextArea.reopen(AutoResize, {

  /**
    By default, textareas only resize
    their height.

    @attribute shouldResizeHeight
    @type Boolean
   */
  shouldResizeHeight: true,

  /**
    Whitespace should be treated as significant
    for text areas.

    @attribute significantWhitespace
    @default true
    @type Boolean
   */
  significantWhitespace: true,

  /**
    Optimistically resize the height
    of the textarea so when users reach
    the end of a line, they will be
    presented with space to begin typing.

    @attribute autoResizeText
    @type String
   */
  autoResizeText: Ember.computed('value', {
    get() {
      var value = get(this, 'value');
      if (isNone(value)) {
        value = '';
      }
      return value + '@';
    }
  })

});
