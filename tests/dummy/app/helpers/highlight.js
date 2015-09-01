import Ember from 'ember';
import highlight from '../system/highlight';

const { htmlSafe } = Ember.String;

export default Ember.Helper.helper(function (params) {
  let statements = highlight(params.join(''));

  return htmlSafe(statements.map(function (statement) {
    let html = statement.value.replace(/>/g, '&gt;')
                              .replace(/</g, '&lt;')
                              .replace(/ /g, '&nbsp;')
                              .replace(/\n/g, '<br>');
    if (statement.type === 'text') {
      return html;
    }
    return `<span class="${statement.type}">${html}</span>`;
  }).join(''));
});
