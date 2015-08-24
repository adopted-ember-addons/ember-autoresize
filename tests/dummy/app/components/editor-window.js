import Ember from 'ember';
import snippets from '../snippets';

const { get } = Ember;

export default Ember.Component.extend({
  title: '',
  classNames: ['window', 'editor'],
  text: Ember.computed('title', function () {
    return snippets[get(this, 'title')];
  }),

  lines: Ember.computed('text', function () {
    let lines = get(this, 'text').split('\n');
    let start = lines[0].length - lines[0].trim().length;
    return lines.map(function (code, i) {
      return {
        code: code.slice(start) || '\n',
        number: i + 1
      };
    });
  })
});
