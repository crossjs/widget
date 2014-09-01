define(function(require, exports, module) {

  /**
   * 自动渲染 widget
   * 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
   *
   * @module Widget
   * @class AutoRender
   * @static
   * @param root 渲染的 dom 范围，默认是 body
   * @param callback 渲染后执行的回调
   */

  'use strict';

  var $ = require('$');

  var daParser = require('./daparser');

  var DATA_WIDGET = 'data-widget',
    DATA_WIDGET_API = 'data-widget-api',
    DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered',
    DATA_WIDGET_ROLE = 'data-widget-role';

  /**
   * 检查元素是否关闭 data-api
   *
   * @method isDataAPIOff
   * @private
   * @param element
   * @return {boolean}
   */
  function isDataAPIOff(element) {
    return element.getAttribute(DATA_WIDGET_API) === 'off';
  }

  module.exports = function(root, callback) {
    var modules = [],
      elements = [];

    if (typeof root === 'function') {
      callback = root;
      root = null;
    }

    root || (root = document.body);

    if (!(root instanceof $)) {
      root = $(root);
    }

    // 判断全局关闭
    if (isDataAPIOff(root[0])) {
      // 全局关闭，执行回调
      callback && callback(-1);
      return;
    }

    root.find('[' + DATA_WIDGET + ']').each(function(i, element) {
      var module;
      // 已经渲染过
      if (!element.getAttribute(DATA_WIDGET_AUTO_RENDERED)) {
        module = element.getAttribute(DATA_WIDGET).toLowerCase();
        if (seajs.data.alias[module]) {
          // 判断单个关闭
          if (!isDataAPIOff(element)) {
            modules.push(module);
            elements.push(element);
          }
        }
      }
    });

    if (!modules.length) {
      // 没有模块，执行回调
      callback && callback(0);
      return;
    }

    seajs.use(modules, function() {
      var i,
        n = arguments.length,
        element,
        options;

      for (i = 0; i < n; i++) {
        element = elements[i];

        options = daParser(element);

        // DATA_WIDGET_ROLE
        // 是指将当前的 DOM 作为 role 的属性去实例化，
        // 默认的 role 为 element
        options[element.getAttribute(DATA_WIDGET_ROLE) || 'element'] = element;

        // 调用自动渲染接口
        new(arguments[i])(options);

        // 标记已经渲染过
        element.setAttribute(DATA_WIDGET_AUTO_RENDERED, 'true');
      }

      // 在所有自动渲染完成后，执行回调
      callback && callback(1);
    });
  };

});
