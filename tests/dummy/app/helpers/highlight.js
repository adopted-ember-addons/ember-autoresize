import Ember from 'ember';

const { htmlSafe } = Ember.String;

export default Ember.Helper.helper(function (params) {
  let handlebars = params.join('');

  return htmlSafe(handlebars.replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;')
                  .replace(/ /g, '&nbsp;')
                  .replace(/\n/g, '<br>')
                  .replace(/([a-z-]+)=/g, function (_, attr) {
    return `<span class='attribute'>${attr}</span>=`;
  }).replace(/("[^"]*"|true|false)/g, function (string) {
    return `<span class='string'>${string}</span>`;
  }).replace(/{{([#\/]?)([a-z-]+)&nbsp;/g, function (_, prefix, helper) {
    return `{{${prefix}<span class="helper">${helper}</span>&nbsp;`;
  }).replace(/{{\/([a-z-]+)}}/g, function (_, helper) {
    return `{{/<span class="helper">${helper}</span>}}`;
  }).replace(/([;{=])([a-z]+\.[a-z]+)([&}])/g, function (_, prefix, title, postfix) {
    return `${prefix}<span class="literal">${title}</span>${postfix}`;
  }).replace(/=([a-zA-Z0-9]+)/g, function (_, title) {
    return '=<span class="literal">' + title + '</span>';
  }).replace(/&lt;([a-z1-6]+)&nbsp;/g, function (_, tag) {
    return `&lt;<span class="helper">${tag}</span>&nbsp;`;
  }).replace(/&lt;([a-z1-6]+)&gt;/g, function (_, tag) {
    return `&lt;<span class="helper">${tag}</span>&gt;`;
  }).replace(/\/([a-z1-6]+)&gt;/g, function (_, tag) {
    return `/<span class="helper">${tag}</span>&gt;`;
  }));
});
