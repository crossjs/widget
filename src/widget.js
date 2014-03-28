define(function (require, exports, module) {

/**
 * 组件基类
 *
 * @module Widget
 */

'use strict';

var $ = require('$'),
  Class = require('class'),
  Events = require('events').prototype,

  Aspect = require('./aspect').prototype;

var DELEGATE_SPLITTER = /^(\S+)\s*(.*)$/,
  DELEGATE_NAMESPACE = '.delegate-widget-';

// TODO: 检查是否有内存泄漏发生

/**
 * 组件基类
 *
 * 扩展 Events 与 Aspect (AOP)
 *
 * @class Widget
 * @constructor
 * @requires Events
 * @requires Aspect
 *
 * @example
 * ```
 * // 创建子类
 * var PersonWidget = Widget.extend({
 *   setup: function () {
 *     // 通知事件 `setup`
 *     this.fire('setup', this.option('name'), this.option('age'));
 *   }
 * });
 * // 创建子类实例
 * var tom = new PersonWidget({
 *   name: 'Tom',
 *   age: 21,
 *   // 订阅事件
 *   events: {
 *     // `setup`
 *     setup: function (e, name, age) {
 *       // e === 'setup'
 *       // name === 'Tom'
 *       // age === 21
 *       // this === tom
 *     },
 *     // AOP `before:setup`
 *     'before:setup': function (e) {
 *       // 执行 `setup` 方法前执行
 *       // 此处返回 `false` 将阻止 `setup` 方法执行
 *     },
 *     // AOP `before:setup`
 *     'before:setup': function (e) {
 *       // 执行 `setup` 方法后执行
 *       // 如果 `setup` 方法被阻止，就不会执行到这里
 *     }
 *   },
 *   // 代理事件
 *   delegates: {
 *     'click': function (e) {
 *       // e.target === this.element[0]
 *       // this === tom
 *     },
 *     'mouseover .avatar': function (e) {
 *       // 鼠标悬停在 element 里的 `.avatar` 元素
 *     }
 *   }
 * });
 * ```
 */
var Widget = Class.create(Events, Aspect, {

  /**
   * 初始化函数，将自动执行；实现事件自动订阅与初始化组件参数
   *
   * @method initialize
   * @param {Object} options 组件参数
   */
  initialize: function (options) {
    options || (options = {});

    if (options.events) {

      // 初始化 events
      $.each(options.events, $.proxy(function (event, callback) {
        var match = /^(before|after):(\w+)$/.exec(event);
        if (match) {
          // AOP
          this[match[1]](match[2], callback);
        } else {
          // Subscriber
          this.on(event, callback);
        }
      }, this));
    }

    // 合并继承的 `defaults`

    // 初始化组件参数，只读
    this.__options = mergeDefaults(this, options);

    // this.UI = {
    //   'default': {}
    // };

    // 容器与元素
    this.container = $(this.option('container'));
    this.element = $(this.option('element'))
        .addClass(this.option('classPrefix'));

    // 初始化事件代理
    this.delegate();

    // 实例唯一ID
    this.uniqueId = uniqueId();

    this.setup();
  },

  /**
   * 默认参数，子类自动继承并覆盖
   *
   * @property {Object} defaults
   * @type {Object}
   */
  defaults: {
    // TODO: ue-component 改成 pandora 之类的，以与旧版组件做区别？
    element: '<div class="ue-component"></div>',
    container: 'body'
  },

  /**
   * 寻找 element 后代
   *
   * @method $
   * @param {Mixed} selector 选择符
   * @return {Object} jQuery 包装的 DOM 节点
   */
  $: function (selector) {
    return this.element.find(selector);
  },

  /**
   * 自动执行的设置函数，预留用于子类覆盖
   *
   * @method setup
   */
  setup: function () {
  },

  /**
   * 存取组件状态
   *
   * @method state
   * @param {Number} [state] 状态值
   * @return {Mixed} 当前状态值或当前实例
   */
  state: function (state) {
    if (state === undefined) {
      return this.__state;
    }

    this.__state = state;
    return this;
  },

  /**
   * 获取初始化后的组件参数
   *
   * @method option
   * @param {String} [key] 键
   * @return {Mixed} 整个参数列表或指定参数值
   */
  option: function (key) {
    var options = this.__options;
    return ((key === undefined) ? options :
      (options.hasOwnProperty(key) ? options[key] : undefined));
  },

  /**
   * 存取组件数据；用于管理动态生成的数据，如服务端返回
   *
   * @method data
   * @param {String} [key] 键
   * @param {Mixed} [value] 值
   * @return {Mixed} 整个数据、指定键值或当前实例
   */
  data: function (key, value) {
    var datas = this.__datas || (this.__datas = {});

    if (key === undefined) {
      return datas;
    }

    if ($.isPlainObject(key)) {
      $.extend(true, datas, key);
    } else {

      if (value === undefined) {
        return (datas.hasOwnProperty(key) ? datas[key] : undefined);
      } else {
        datas[key] = value;
      }
    }

    return this;
  },

  /**
   * 事件代理，绑定在 element 上
   *
   * @method delegate
   * @param {Object|Function} [delegates] 代理事件列表
   * @return {Object} 当前实例
   */
  delegate: function (delegates) {
    var self = this;

    delegates || (delegates = this.option('delegates'));

    if (!delegates) {
      return this;
    }

    if (typeof delegates === 'function') {
      delegates = delegates.call(this);
    }

    $.each(delegates, function (key, callback) {
      var match = key.match(DELEGATE_SPLITTER),
        event = match[1] + DELEGATE_NAMESPACE + self.uniqueId;

      if (match[2]) {
        self.element.on(event, match[2], $.proxy(callback, self));
      } else {
        self.element.on(event, $.proxy(callback, self));
      }
    });

    return this;
  },

  /**
   * 插入elemnt到container
   * @method render
   */
  render: function () {
    if (!this.rendered) {

      // 插入到容器中
      this.container.append(this.element);

      /**
       * `element` 所在的 `document` 对象
       *
       * @property {Object} document
       */
      this.document = this.element.prop('ownerDocument');

      /**
       * `element` 所在的 `window` 对象
       *
       * @property {Object} viewport
       */
      this.viewport = (function (doc) {
        return doc.defaultView || doc.parentWindow;
      })(this.document);

      this.rendered = true;
    }
  },

  /**
   * 销毁当前组件对象
   * @method destroy
   */
  destroy: function () {
    var prop;

    // 移除事件订阅
    this.off();

    // 移除 element 事件代理
    this.element.off(DELEGATE_NAMESPACE + this.uniqueId);

    // 从DOM中移除element
    this.element.remove();

    // 移除属性
    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        delete this[prop];
      }
    }

    this.destroy = function() { };
  }

});

function mergeDefaults(instance, options) {
  var arr = [options],
    proto = instance.constructor.prototype;

  while (proto) {
    if (proto.hasOwnProperty('defaults')) {
      arr.unshift(proto.defaults);
    }

    proto = proto.constructor.superclass;
  }

  arr.unshift(true, {});

  return $.extend.apply(null, arr);
}

var uniqueId = (function () {
  var ids = {};
  return function () {
    var id = Math.random().toString(36).substr(2);
    if (ids[id]) {
      return uniqueId();
    }
    ids[id] = true;
    return id;
  };
})();

module.exports = Widget;

});
