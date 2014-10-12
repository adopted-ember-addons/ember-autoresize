import Ember from "ember";
import AutoResize from "../mixins/autoresize";

var get = Ember.get;
var isNone = Ember.isNone;

/**
  @namespace Ember
  @class TextArea
 */
Ember.TextArea.reopen(AutoResize, /** @scope Ember.TextArea.prototype */{

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
    var value = get(this, 'value');
    if (isNone(value)) {
      value = '';
    }
    return value + '@';
  })

});
