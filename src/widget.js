define(function (require, exports, module) {

/**
 * 组件基础类
 * @module Widget
 */

'use strict';

var /*$ = require('$'),*/
  Class = require('class'),
  Events = require('events').prototype,

  Aspect = require('./aspect').prototype;

// TODO: 检查是否有内存泄漏发生

/**
 * 组件基础类
 *
 * 实现自动事件订阅
 * @class Widget
 * @constructor
 * @example
 * ```
 * var SomeWidget = Widget.extend({
 *   initialize: function (name, age) {
 *     this.name = name;
 *     this.age = age;
 *   }
 * });
 * var tom = new SomeWidget('Tom', 21, 'MIT');
 * // now:
 * // tom.name === 'Tom';
 * // tom.age === 21;
 * // tom.school === 'MIT';
 * ```
 */
var Widget = Class.create(Events, Aspect, {

  initialize: function (options) {
    options || (options = {});

    if (options.events) {

      // init aspect
      $.each(options.events, function (event, callback) {
        var match = /^(before|after):(\w+)$/.exec(event);
        if (match) {
          this[match[1]](match[2], callback);
          delete options.events[event];
        }
      });

      // init events
      this.on(options.events);
    }

    this.options = options;

    // this.UI = {
    //   'default': {}
    // };
  },

  setup: function () {
  },

  render: function () {
    // this.element
  },

  destroy: function () {
    // 移除事件绑定
    this.off();
  }

});

return Widget;

});
