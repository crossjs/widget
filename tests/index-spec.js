var $ = require('jquery');
var expect = require('expect.js');
var Widget = require('../widget');


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

describe('autorender', function() {
  it('autoRender', function() {
    var widget = $('<div id="test0" data-widget-class-name="widget"></div>').appendTo('body');

    Widget.autoRender(function() {
      var test = Widget.get($('#test0'));

      expect(test).to.not.be.ok();
    });
  });

  it('autoRender', function() {
    var widget = $('<div data-widget="widget" id="test1" data-widget-class-name="widget"></div>').appendTo('body');

    Widget.autoRender(function(state) {
      var test = Widget.get($('#test1'));

      expect(test.option('className')).to.be('widget');
      expect(test.element[0]).to.be(widget[0]);
      expect(state).to.be(1);
    });

    Widget.autoRender(function(state) {
      var test = Widget.get($('#test1'));

      expect(test.option('className')).to.be('widget');
      expect(test.element[0]).to.be(widget[0]);
      expect(state).to.be(0);
    });
  });

  it('autoRender', function() {
    document.body.setAttribute('data-widget-api', 'off');

    Widget.autoRender(function(state) {
      var test = Widget.get($('#test0'));

      expect(state).to.be(-1);
    });
  });
});

describe('daparser-ancient', function() {

});

describe('daparser', function() {

});

describe('widget', function() {
  
});
