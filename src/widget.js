define(function (require, exports, module) {

/**
 * 组件基类
 *
 * @module Widget
 */

'use strict';

var $ = require('$'),
  Base = require('base');

var DELEGATE_SPLITTER = /^(\S+)\s*(.*)$/,
  DELEGATE_NAMESPACE = '.delegate-widget-';

var cachedInstances = {};

// TODO: 检查是否有内存泄漏发生

/**
 * 组件基类
 *
 * @class Widget
 * @constructor
 * @extends Base
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
var Widget = Base.extend({

  /**
   * 初始化函数，将自动执行；实现事件自动订阅与初始化组件参数
   *
   * @method initialize
   * @param {Object} options 组件参数
   */
  initialize: function (options) {
    Widget.superclass.initialize.apply(this, arguments);

    // this.UI = {
    //   'default': {}
    // };

    // 实例唯一ID
    this.uniqueId = uniqueId();

    // 储存实例
    cachedInstances[this.uniqueId] = this;

    // 容器与元素
    this.container = $(this.option('container'));
    this.element = $(this.option('element'))
        .addClass(this.option('classPrefix'));

    // 初始化事件代理
    this.initDelegates();

    this.setup();
  },

  /**
   * 默认参数，子类自动继承并覆盖
   *
   * @property {Object} defaults
   * @type {Object}
   */
  defaults: {
    // 默认插入到的容器，设置为 `null` 则不执行插入
    container: 'body',
    // TODO: ue-component 改成 pandora 之类的，以与旧版组件做区别？
    element: '<div class="ue-component"></div>',
    // 实现 element 插入到 DOM，基于 container
    insert: function () {
      this.container.length && this.container.append(this.element);
    }
  },

  /**
   * 寻找 element 后代，参数为空时，返回 element
   *
   * @method $
   * @param {Mixed} [selector] 选择符
   * @return {Object} jQuery 包装的 DOM 节点
   */
  $: function (selector) {
    return selector ? this.element.find(selector) : this.element;
  },

  /**
   * 自动执行的设置函数，预留用于子类覆盖
   *
   * @method setup
   */
  setup: function () {
  },

  /**
   * 事件代理，绑定在 element 上
   *
   * @method initDelegates
   * @param {Object|Function} [delegates] 代理事件列表
   * @return {Object} 当前实例
   */
  initDelegates: function (delegates) {
    delegates || (delegates = this.option('delegates'));

    if (!delegates) {
      return this;
    }

    if (typeof delegates === 'function') {
      delegates = delegates.call(this);
    }

    $.each(delegates, $.proxy(function (key, callback) {
      var match = key.match(DELEGATE_SPLITTER),
        event = match[1] + DELEGATE_NAMESPACE + this.uniqueId;

      if (typeof callback === 'string') {
        callback = this[callback];
      }

      if (match[2]) {
        this.element.on(event, match[2], $.proxy(callback, this));
      } else {
        this.element.on(event, $.proxy(callback, this));
      }
    }, this));

    return this;
  },

  /**
   * 插入elemnt到container
   * @method render
   */
  render: function () {
    var content,
      template = this.option('template');

    if (!this.rendered) {

      // 插入到容器中
      this.option('insert').call(this);

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

    if (typeof template === 'function') {
      content = template(this.data());
    } else {
      content = this.option('content');
    }

    if (typeof content !== 'undefined') {
      this.element.html(content);
    }
  },

  /**
   * 销毁当前组件对象
   * @method destroy
   */
  destroy: function () {
    // 移除 element 事件代理
    this.element.off();

    // 从DOM中移除element
    this.element.remove();

    Widget.superclass.destroy.apply(this);
  }

});

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

// For memory leak, from aralejs
$(window).unload(function() {
  var cid;
  for(cid in cachedInstances) {
    cachedInstances[cid].destroy();
  }
});

module.exports = Widget;

});
