import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import Autoresize from 'ember-autoresize/mixins/autoresize';

export default Component.extend(Autoresize, {
  shouldResizeHeight: true,
  significantWhitespace: true,
  autoresize: true,
  autoresizeElement: computed({
    set(_, value) {
      return value;
    }
  }),

  didRender() {
    let textarea = this.element.querySelector('textarea');
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;

    this.set('autoresizeElement', textarea);
    textarea.value = this.get('value') || '';
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionEnd;
  },

  autoResizeText: computed('value', 'placeholder', function () {
    let placeholder = this.get('placeholder');
    let value = this.get('value');

    if (isEmpty(value)) {
      return isEmpty(placeholder) ? '.' : placeholder;
    }

    return value;
  }),

  actions: {
    setValue() {
      let textarea = this.get('element').querySelector('textarea');
      this.get('onchange')(textarea.value);
    }
  }
});
