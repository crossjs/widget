define(function (require, exports) {

  'use strict';

  var Widget = require('../src/widget');

  QUnit.start();

  module('Module Widget');
  test('Widget', function() {
    notEqual( new Widget(), new Widget(), '' );
  });

  module('Module Construct');
  test('Construct', function() {
    var WidgetA = Widget.extend({
      initialize: function (x) {
        this.x = x;
      }
    });
    equal( new WidgetA(2).x, 2, '' );
  });

  module('Module Events');
  test('Events', function() {
    var instance = new Widget({
      events:{
        test: function (e, t) {
          this.t = t;
          this.e = e;
        }
      }
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });
  test('Events', function() {
    var instance = new Widget();
    instance.on('test', function (e, t) {
      this.t = t;
      this.e = e;
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });
  test('Events', function() {
    var instance = new Widget();
    instance.on({
      test: function (e, t) {
        this.t = t;
        this.e = e;
      }
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });

});