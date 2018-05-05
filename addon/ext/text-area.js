import TextArea from '@ember/component/text-area';
import { isEmpty, isNone } from '@ember/utils';
import { get, computed } from '@ember/object';
import AutoResize from "../mixins/autoresize";

/**
  @element text-area
 */
TextArea.reopen(AutoResize, {

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

    If a placeholder is set,
    it will be used instead of the value.

    @attribute autoResizeText
    @type String
   */
  autoResizeText: computed('value', 'placeholder', {
    get() {
      var placeholder = get(this, 'placeholder');
      var value = get(this, 'value');
      var fillChar = '@';

      if (isEmpty(value)) {
        return isEmpty(placeholder) ? fillChar : placeholder + fillChar;
      }

      if (isNone(value)) {
        value = '';
      }

      return value + fillChar;
    }
  })

});
