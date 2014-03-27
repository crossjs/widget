define(function (require, exports) {

  'use strict';

  var Widget = require('../src/widget');

  QUnit.start();

  test('new', function() {
    notEqual( new Widget(), new Widget(), 'new' );
  });

  test('constructor', function() {
    var WidgetA = Widget.extend();
    var widgetA = new WidgetA();
    equal( widgetA.constructor, WidgetA, 'constructor' );
    notEqual( widgetA.constructor, Widget, 'constructor' );
  });

  test('instanceof', function() {
    var WidgetA = Widget.extend();
    var widgetA = new WidgetA();
    ok( widgetA instanceof WidgetA, 'instanceof' );
    ok( widgetA instanceof Widget, 'instanceof' );
  });

  test('extend', function() {
    var WidgetA = Widget.extend({
      world: 'earth',
      hello: function () {
        return 'hello ' + this.world;
      }
    });
    var widgetA = new WidgetA();
    equal( widgetA.world, 'earth', '' );
    equal( widgetA.hello(), 'hello earth', '' );
  });

  test('setup', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.x = this.option('x');
      }
    });
    var widgetA = new WidgetA({
      x: 2,
      y: 3
    });
    equal( widgetA.x, 2, '' );
    equal( widgetA.y, undefined, '' );
  });

  test('render', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
    });
    widgetA.render();
    widgetA.render();
    equal( $('.ue-component').length, 1, '' );
    // for next tests
    widgetA.destroy();
  });

  test('$', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
        this.element.html('<p>123</p>');
      }
    });
    var widgetA = new WidgetA();
    equal( widgetA.$('p').length, 1, '' );
    // for next tests
    widgetA.destroy();
  });

  test('destroy', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
    });
    widgetA.render();
    widgetA.destroy();
    widgetA.destroy();
    equal( widgetA.element, undefined, '' );
    equal( $('.ue-component').length, 0, '' );
  });

  test('state', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
    });
    equal( widgetA.state(), undefined, '' );
    widgetA.state(1);
    equal( widgetA.state(), 1, '' );
  });

  test('option', function() {
    var WidgetA = Widget.extend({
      defaults: {
        y: 5,
        z: 4
      }
    });
    var events = {
      a: function () {
      },
      b: function () {
      }
    };
    var widgetA = new WidgetA({
      x: 2,
      y: 3,
      z: 4,
      events: events
    });
    deepEqual( widgetA.option(), {
      container: 'body',
      element: '<div class="ue-component"></div>',
      x: 2,
      y: 3,
      z: 4,
      events: events
    }, '' );
    equal( widgetA.option('y'), 3, '' );
    equal( widgetA.option('w'), undefined, '' );
    deepEqual( widgetA.option('events'), events, '' );
  });

  test('data', function() {
    var WidgetA = Widget.extend({
    });
    var widgetA = new WidgetA({
    });
    deepEqual( widgetA.data(), {}, '' );
    equal( widgetA.data('a', '1'), widgetA, '' );
    equal( widgetA.data('a'), '1', '' );
    equal( widgetA.data('hasOwnProperty'), undefined, 'built-in property returns undefined' );
    equal( widgetA.data('b'), undefined, '' );
    equal( widgetA.data({b: '2'}), widgetA, '' );
    deepEqual( widgetA.data(), {a: '1', b: '2'}, '' );
  });

  test('delegate', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      }
    });
    var widgetA = new WidgetA({
      element: '<div></div>',
      delegates: {
        'click': function (e) {
          ok( true, 'clicked' );
        }
      }
    });
    widgetA.element.click();
    widgetA.destroy();
  });

  test('delegate', function() {
    var WidgetA = Widget.extend({
      setup: function () {
        this.render();
      }
    });
    var widgetA = new WidgetA({
      element: '<div><button>button</button></div>',
      delegates: function () {
        var delegates = {
          'click button': function (e) {
            ok( true, 'clicked' );
          }
        };
        return delegates;
      }
    });
    widgetA.element.find('button').click();
    widgetA.destroy();
  });

  test('events', function() {
    var widget = new Widget({
      events: {
        test: function (e, t) {
          this.t = t;
          this.e = e;
        }
      }
    });
    widget.fire('test', '2');
    equal( widget.e, 'test', '' );
    equal( widget.t, '2', '' );
    widget.off('test');
    widget.fire('test', '4');
    equal( widget.t, '2', '' );
  });

  test('AOP', function() {
    var WidgetA = Widget.extend({
      hello: function () {
        return 'hello ' + this.data('world');
      }
    });
    var widgetA = new WidgetA({
      events: {
        'before:hello': function () {
          if (this.data('world') === 'mars') {
            return false;
          }
          this.data('world', 'mars');
          ok( true, 'before called');
        },
        'after:hello': function (e, result) {
          ok( true, 'after called');
        },
        'after:hello2': function (e, result) {
        }
      },
      world: 'earth'
    });
    equal( widgetA.hello(), 'hello mars', 'method called' );
    equal( widgetA.hello(), undefined, 'prevented' );
  });

});