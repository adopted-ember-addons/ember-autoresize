import Ember from 'ember';
import snippets from '../snippets';

const { get } = Ember;

export default Ember.Component.extend({
  title: '',
  classNames: ['window', 'editor'],
  text: Ember.computed('title', function () {
    return snippets[get(this, 'title')]
  }),

  lines: Ember.computed('text', function () {
    return get(this, 'text').split('\n').map(function (code, i) {
      return {
        code: code || '\n',
        number: i + 1
      };
    });
  })
});
