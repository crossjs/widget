define(function(require, exports, module) {

  'use strict';

  var $ = require('$');

  /**
   * 处理子组件，仅支持 widget 的子类
   */

  module.exports = function(parent, children) {
    var roleContent,
      i,
      n,
      child,
      uniqueId = parent.uniqueId;

    /*jshint validthis:true */
    function replaceDummy() {
      this['dummy' + uniqueId].replaceWith(this.element);
    }

    if (children) {
      roleContent = parent.role(parent.option('contentRole'));
      if (roleContent.length === 0) {
        roleContent = parent.element;
      }

      for (i = 0, n = children.length; i < n; i++) {
        child = children[i];
        if (child.rendered) {
          roleContent.append(child.element);
        } else {
          // 异步加载子 widget，添加占位符，保证顺序
          child['dummy' + uniqueId] =
            $('<div/>', parent.document).appendTo(roleContent);

          child.once('render', replaceDummy);
        }
      }
    }
  };

});
