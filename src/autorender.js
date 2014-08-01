define(function (require, exports, module) {

'use strict';

/**
 * AutoRender
 * --------
 * 自动渲染 widget
 *
 * @module AutoRender
 * @class AutoRender
 * @static
 */

var $ = require('$');

var daParser = require('./daparser');

var DATA_WIDGET = 'data-widget',
  DATA_WIDGET_API = 'data-widget-api',
  DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered',
  DATA_WIDGET_ROLE = 'data-widget-role';

/**
 * 是否没开启 data-api
 *
 * @method isDataAPIOff
 * @param element
 * @returns {boolean}
 */
function isDataAPIOff (element) {
  return element.getAttribute(DATA_WIDGET_API) === 'off';
}

/**
 * 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
 *
 * @method renderAll
 * @static
 * @param root 渲染的 dom 范围，默认是 body
 * @param callback 渲染后执行的回调
 */
module.exports = function (root, callback) {
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
    return;
  }

  root.find('[' + DATA_WIDGET + ']').each(function (i, element) {
    // 判断单个关闭
    if (!isDataAPIOff(element)) {
      modules.push(element.getAttribute(DATA_WIDGET).toLowerCase());
      elements.push(element);
    }
  });

  if (!modules.length) {
    return;
  }

  seajs.use(modules, function () {
    var i,
        n = arguments.length,
        element,
        options;

    for (i = 0; i < n; i++) {
      element = elements[i];

      // 已经渲染过
      if (element.getAttribute(DATA_WIDGET_AUTO_RENDERED)) {
        continue;
      }

      options = daParser(element);

      // DATA_WIDGET_ROLE
      // 是指将当前的 DOM 作为 role 的属性去实例化，
      // 默认的 role 为 element
      options[element.getAttribute(DATA_WIDGET_ROLE) || 'element'] = element;

      // 调用自动渲染接口
      new (arguments[i])(options);

      // 标记已经渲染过
      element.setAttribute(DATA_WIDGET_AUTO_RENDERED, 'true');
    }

    // 在所有自动渲染完成后，执行回调
    callback && callback();
  });
};

});
