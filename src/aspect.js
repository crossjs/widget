define(function (require, exports, module) {

/**
 * Aspect
 *
 * http://http://en.wikipedia.org/wiki/Aspect-oriented_programming
 * https://github.com/aralejs/base/blob/master/src/aspect.js
 *
 * @module Aspect
 *
 * @requires Events
 */

'use strict';

var $ = require('$');

/**
 * Aspect
 * @class Aspect
 * @constructor
 */
var Aspect = function () { };

Aspect.prototype = {

  /**
   * 方法执行前执行
   * @method before
   * @param {String} methodName 事件名
   * @param {Function} callback 回调函数
   * @param {Object} context 上下文
   * @return {Object} 当前实例
   */
  before: function (methodName, callback, context) {
    return wave.call(this, 'before', methodName, callback, context);
  },

  /**
   * 方法执行后执行
   * @method after
   * @param {String} methodName 事件名
   * @param {Function} callback 回调函数
   * @param {Object} context 上下文
   * @return {Object} 当前实例
   */
  after: function (methodName, callback, context) {
    return wave.call(this, 'after', methodName, callback, context);
  }

};

function wave (when, methodName, callback, context) {
  /*jshint validthis: true*/
  var method = this[methodName];

  if (method) {
    if (!method.__aspected) {
      wrap.call(this, methodName);
    }

    this.on(when + ':' + methodName, callback, context);
  }

  return this;
}

// wrap
function wrap (methodName) {
  /*jshint validthis: true*/
  var method = this[methodName];
  this[methodName] = function () {
    var args = Array.prototype.slice.call(arguments),
      result;

    // before
    if (this.fire.apply(this, ['before:' + methodName].concat(args)) === false) {
      return;
    }

    // method
    result = method.apply(this, arguments);

    // after
    this.fire.apply(this, ['after:' + methodName, result].concat(args));

    return result;
  };

  this[methodName].__aspected = true;
}

module.exports = Aspect;

});
