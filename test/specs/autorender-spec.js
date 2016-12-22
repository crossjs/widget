var $ = require('jquery');
var Widget = require('../../src');

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
