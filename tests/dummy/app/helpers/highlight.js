import Ember from 'ember';

const { htmlSafe } = Ember.String;

export default Ember.Helper.helper(function (params) {
  let handlebars = params.join('');

  return htmlSafe(handlebars.replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;')
                  .replace(/\n/g, '<br>')
                  .replace(/([a-z-]+)=/g, function (_, attr) {
    return `<span class='attribute'>${attr}</span>=`;
  }).replace(/("[^"]*"|true|false)/g, function (string) {
    return `<span class='string'>${string}</span>`;
  }).replace(/{{([a-z-]+) /g, function (_, helper) {
    return '{{<span class="helper">' + helper + '</span> ';
  }).replace(/[a-z]+\.[a-z]+/g, function (title) {
    return '<span class="literal">' + title + '</span>';
  }).replace(/=([a-zA-Z0-9]+)/g, function (_, title) {
    return '=<span class="literal">' + title + '</span>';
  }).replace(/&lt;([a-z1-6]+) /g, function (_, tag) {
    return `&lt;<span class="helper">${tag}</span> `;
  }).replace(/&lt;([a-z1-6]+)&gt;/g, function (_, tag) {
    return `&lt;<span class="helper">${tag}</span>&gt;`;
  }).replace(/\/([a-z1-6]+)&gt;/g, function (_, tag) {
    return `/<span class="helper">${tag}</span>&gt;`;
  }));
});
