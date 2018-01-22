import TextField from '@ember/component/text-field';
import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import AutoResize from "../mixins/autoresize";

/**
  @element input
 */
TextField.reopen(AutoResize, {

  /**
    By default, text fields only
    resize their width.

    @attribute shouldResizeWidth
    @default true
    @type Boolean
   */
  shouldResizeWidth: true,

  /**
    Whitespace should be treated as significant
    for text fields.

    @attribute significantWhitespace
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

    @attribute autoResizeText
    @type String
   */
  autoResizeText: computed('value', 'placeholder', {
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
