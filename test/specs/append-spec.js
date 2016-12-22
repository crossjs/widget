var $ = require('jquery');
var Widget = require('../../src');

describe('append', function() {
  it('append sync', function() {
    var widgetA = new Widget({
        classPrefix: 'ue-test-a'
      }),
      widgetB = new Widget({
        classPrefix: 'ue-test-b',
        children: [widgetA]
      });
    widgetA.render();
    widgetB.render();
    expect($('.ue-test-b .ue-test-a').length).to.be(1);
    widgetA.destroy();
    widgetB.destroy();
  });

  it('append async', function() {
    var widgetA = new Widget({
        classPrefix: 'ue-test-a'
      }),
      widgetB = new Widget({
        classPrefix: 'ue-test-b',
        children: [widgetA]
      });
    widgetB.render();
    widgetA.render();
    expect($('.ue-test-b .ue-test-a').length).to.be(1);
    widgetA.destroy();
    widgetB.destroy();
  });
});
