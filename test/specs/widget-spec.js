var $ = require('jquery');
var Widget = require('../../src');

describe('widget', function() {
  it('new', function() {
    var widget1 = new Widget();
    var widget2 = new Widget();
    expect(widget1).to.be.ok();
    expect(widget1).not.to.be(widget2);
  });

  it('Widget.get/widget.getWidget', function() {
    var WidgetA = Widget.extend();
    var widgetA = new WidgetA();
    expect( Widget.get(widgetA.element)).to.equal(widgetA);
    expect( widgetA.getWidget(widgetA.element)).to.equal(widgetA);
  });

  it('constructor', function() {
    var WidgetA = Widget.extend();
    var widgetA = new WidgetA();
    expect( widgetA.constructor).to.be.a('function');
    expect( widgetA.constructor).not.to.be.a(Widget);
  });

  it('instanceof', function() {
    var WidgetA = Widget.extend();
    var widgetA = new WidgetA();
    expect( widgetA instanceof WidgetA).to.be.ok();
    expect( widgetA instanceof Widget).to.be.ok();
  });

  it('extend', function() {
    var WidgetA = Widget.extend({
      world: 'earth',
      hello: function () {
        return 'hello ' + this.world;
      }
    });
    var widgetA = new WidgetA();
    expect( widgetA.world).to.be('earth');
    expect( widgetA.hello()).to.be('hello earth');
  });

  it('setup', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.x = this.option('x');
      }
    });
    var widgetA = new WidgetA({
      x: 2,
      y: 3
    });
    expect( widgetA.x).to.be(2);
    expect( widgetA.y).to.be(undefined);
  });

  it('data', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      data: {
        a: 1
      }
    });
    expect( widgetA.option('data/a')).to.be(1);
    expect(widgetA.option('data')).to.eql({a: 1});
    expect( widgetA.data('a')).to.be(1);
    expect( widgetA.data('a/b/c/d', 1)).to.eql(widgetA);
    expect( widgetA.data('a/b/c/d')).to.be(1);
    expect(widgetA.data('a/b/c/')).to.eql({d:1});
    expect( widgetA.data('hasOwnProperty')).to.be(undefined);
    expect( widgetA.data('b')).to.be(undefined);
    expect( widgetA.data({a: '2'})).to.eql(widgetA);
    expect( widgetA.data('a')).to.be('2');
    expect( widgetA.data('a/b')).to.be(undefined);
    expect(widgetA.data()).to.eql({a: '2'});
  });

  it('data/override', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      data: {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      }
    });
    expect( widgetA.data('b/c')).to.be(2);
    expect( widgetA.data('b/d')).to.be(3);
    widgetA.data('b', {e: 4});
    expect( widgetA.data('b/d')).to.be(3);
    expect( widgetA.data('b/e')).to.be(4);
    widgetA.data('b', {e: 4}, true);
    expect( widgetA.data('b/d')).to.be(undefined);
    expect( widgetA.data('b/e')).to.be(4);
  });

  it('render', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      classPrefix: 'ue-test'
    });
    widgetA.render();
    expect($('.ue-test').length).to.be(1);
    // for next tests
    widgetA.destroy();
  });

  it('trigger', function() {
    var trigger = $('<button id="trigger"></button>').appendTo('body');
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      classPrefix: 'ue-test',
      trigger: '#trigger'
    });
    widgetA.render();
    expect($('.ue-test').length).to.be(1);
    expect($('.ue-test').is(':hidden')).to.be.ok();
    $('#trigger').trigger('click');
    expect($('.ue-test').length).to.be(1);
    expect($('.ue-test').is(':visible')).to.be.ok();
    // for next tests
    widgetA.destroy();
  });

  it('is/show/hide', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
    });
    var i = 0;
    widgetA.show(function() {
      i++;
    });
    widgetA.hide(function() {
      i++;
    });
    widgetA.render();
    expect(i).to.be(0);
    expect(widgetA.is(':visible')).to.be.ok();
    widgetA.hide();
    expect(i).to.be(1);
    expect(widgetA.is(':hidden')).to.be.ok();
    widgetA.show();
    expect(i).to.be(2);
    expect(widgetA.is(':visible')).to.be.ok();
    // for next tests
    widgetA.destroy();
  });

  it('template', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      classPrefix: 'ue-test',
      template: function () {
        return 123;
      }
    });
    widgetA.render();
    expect($('.ue-test').text()).to.be('123');
    // for next tests
    widgetA.destroy();
  });

  it('insert', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      insert: function () {
        this.container.prepend(this.element);
      }
    });
    widgetA.render();
    widgetA.render();
    expect(widgetA.$().prev().length).to.be(0);
    // for next tests
    widgetA.destroy();
  });

  it('$', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
        this.element.html('<p>123</p>');
      }
    });
    var widgetA = new WidgetA();
    expect(widgetA.$('p').length).to.be(1);
    expect(widgetA.$()).to.be(widgetA.element);
    // for next tests
    widgetA.destroy();
  });

  it('role', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      }
    });
    var widgetA = new WidgetA({
      content: '<p data-role="p">123</p>'
    });
    expect(widgetA.role('p').get(0)).to.equal(widgetA.$('p').get(0));
    // for next tests
    widgetA.destroy();
  });

  it('on(destroy)', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      classPrefix: 'ue-test'
    });
    widgetA.on('destroy', function () {
      expect(true).to.be.ok();
    });
    widgetA.render();
    widgetA.destroy();
    widgetA.destroy();
    expect(widgetA.element).to.not.be.ok();
    expect($('.ue-test').length).to.be(0);
  });

  it('destroy(fn)', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
      classPrefix: 'ue-test'
    });
    widgetA.destroy(function () {
      expect(true).to.be.ok();
    });
    widgetA.render();
    widgetA.destroy();
    widgetA.destroy();
    expect(widgetA.element).to.not.be.ok();
    expect($('.ue-test').length).to.be(0);
  });

  it('delegate', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      },
      test: function () {
        expect(true).to.be.ok();
      }
    });
    var widgetA = new WidgetA({
      element: '<div><button>button</button></div>',
      delegates: {
        'click': function (e) {
          expect(true).to.be.ok();
        },
        'click button': 'test'
      }
    });
    widgetA.element.click();
    widgetA.$('button').click();
    widgetA.destroy();
  });

  it('delegate', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      },
      test: function () {
        expect(true).to.be.ok();
      }
    });
    var widgetA = new WidgetA({
      element: '<div><button>button</button></div>',
      delegates: function () {
        return {
          'click': function (e) {
            expect(true).to.be.ok();
          },
          'click button': 'test'
        };
      }
    });
    widgetA.element.click();
    widgetA.$('button').click();
    widgetA.destroy();
  });

  it('unload', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      }
    });
    var widgetA = new WidgetA();
    $(window).triggerHandler('unload');

    expect(typeof widgetA.element).to.be('undefined');
  });

});
