/*globals $ */
module("Ember.Metrics.layoutOf");

test('should provide correct dimensions for each of the box models', function () {
  $('#qunit-fixture').append('<div id="box" style="width: 10px; height: 10px; padding: 1px 2px 3px 4px; margin: 8px 4px 2px 1px; border-width: 2px 4px 6px 8px; border-style: solid; border-color: #333;"></div>');

  var layout = Ember.Metrics.layoutOf($('#box')[0]);
  deepEqual(layout.content, {
    width: 10,
    height: 10
  });

  deepEqual(layout.padding, {
    width: 16,
    height: 14,
    top: 1,
    right: 2,
    bottom: 3,
    left: 4
  });

  deepEqual(layout.borders, {
    width: 28,
    height: 22,
    top: 2,
    right: 4,
    bottom: 6,
    left: 8
  });

  deepEqual(layout.margins, {
    width: 33,
    height: 32,
    top: 8,
    right: 4,
    bottom: 2,
    left: 1
  });
});
