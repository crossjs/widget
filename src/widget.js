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

var defaults = {
  element: '<div class="ue-component"></div>',
  container: 'body'
};

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

    this.options = $.extend(options, defaults);

    // this.UI = {
    //   'default': {}
    // };
    //

    this.setup();
  },

  setup: function () {
  },

  state: function (state) {
    if (state === undefined) {
      return this.__state;
    }

    this.__state = state;
    return this;
  },

  render: function () {
    var options = this.options;

    if (!this.rendered) {
      this.container = $(options.container);
      this.element = $(options.element);
      // 如果有模板
      if (options.template) {
        this.element.html(options.template(options.data, options.helpers));
      }

      this.rendered = true;
    }

    this.container.append(this.element);
  },

  destroy: function () {
    // 移除事件
    this.off();

    // 移除属性
    for (var p in this) {
      if (this.hasOwnProperty(p)) {
        delete this[p];
      }
    }

    this.destroy = function() { };
  }

});

module.exports = Widget;

});
