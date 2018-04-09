import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({

  tagName: '',

  maxHeightWithUnits: computed('max-height', function () {
    let value = get(this, 'max-height');
    if (value == null) return value;
    if (value.match(/^\d+$/)) {
      return value + 'px';
    }
    return value;
  }),

  maxWidthWithUnits: computed('max-width', function () {
    let value = get(this, 'max-width');
    if (value == null) return value;
    if (value.match(/^\d+$/)) {
      return value + 'px';
    }
    return value;
  }),

  styles: computed('maxHeightWithUnits', 'maxWidthWithUnits', function () {
    if (get(this, 'max-height')) {
      return htmlSafe(`height: ${get(this, 'maxHeightWithUnits')}`);
    } else if (get(this, 'max-width')) {
      return htmlSafe(`width: ${get(this, 'maxWidthWithUnits')}`);
    }
    return htmlSafe('');
  })
});