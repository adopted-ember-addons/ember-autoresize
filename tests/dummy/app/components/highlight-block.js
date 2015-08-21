import Ember from 'ember';
import snippets from '../snippets';

const { get } = Ember;

export default Ember.Component.extend({
  tagName: 'code',
  text: Ember.computed('name', function () {
    return snippets[get(this, 'name')]
  })
});
