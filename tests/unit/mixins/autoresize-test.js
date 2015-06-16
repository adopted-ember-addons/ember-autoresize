import Ember from 'ember';
import AutoresizeMixin from 'ember-autoresize/mixins/autoresize';
import { module, test } from 'qunit';

const { Component } = Ember;

module('Unit | Mixin | autoresize');

test('set/get autoresize property', function(assert) {
  const AutoresizeComponent = Component.extend(AutoresizeMixin);
  const subject = AutoresizeComponent.create({
    element: document.createElement('div')
  });

  assert.equal(!!subject.get('autoresize'), false);

  subject.set('autoresize', true);
  assert.equal(!!subject.get('autoresize'), true);

  subject.set('autoresize', false);
  assert.equal(!!subject.get('autoresize'), false);
});
