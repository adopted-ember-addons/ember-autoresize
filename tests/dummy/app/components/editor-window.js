import Ember from 'ember';
import snippets from '../snippets';
import highlight from '../system/highlight';

const { htmlSafe } = Ember.String;
const { get } = Ember;

export default Ember.Component.extend({
  title: '',
  classNames: ['window', 'editor'],
  text: Ember.computed('title', function () {
    return snippets[get(this, 'title')];
  }),

  formattedText: Ember.computed('text', function () {
    let statements = highlight(get(this, 'text'));

    return statements.map(function (statement) {
      let html = statement.value.replace(/>/g, '&gt;')
                                .replace(/</g, '&lt;');
      if (statement.type === 'text') {
        return html;
      }
      return `<span class="${statement.type}">${html}</span>`;
    }).join('');
  }),

  lines: Ember.computed('formattedText', function () {
    let lines = get(this, 'formattedText').split('\n');
    let start = lines[0].length - lines[0].trim().length;
    return lines.map(function (code, i) {
      return {
        code: htmlSafe(code.slice(start) + '\n'),
        number: i + 1
      };
    });
  })
});
