# pandora-widget

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget 可以构建出任何你想要的 Web 界面组件。
---


*注意测试用例未从 qunit 转到 mocha*


## 使用说明

Widget 继承了 base, 可使用其中包括 class、events、aspect等功能。


### 简单的继承

```js
var WidgetA = Widget.extend({
  defaults: {
    a: 1
  },
  setup: function() {
    this.render();
  },
  method: function() {
    console.log(this.option('a'));
  }
});

var widget = new WidgetA({
  a: 2
});
widget.method(); // => 2

```

### 生命周期

Widget 有一套完整的生命周期，控制着组件从创建到销毁的整个过程。主要有 `initialize`，`render`，`destroy` 三个过程。

#### Initialize

*Widget 在实例化的时候会做一系列操作：*

```js
// widget 唯一 id
self.uniqueId = uniqueId(); 

/**
 * 用于 DOM 事件绑定的 NAMESPACE
 *
 * @property {string} delegateNS
 */
self.delegateNS = DELEGATE_NS_PREFIX + self.uniqueId;

// 初始化 `container` 与 `element`
self.initCnE();

// 事件代理，绑定在 element 上
self.initDelegates();

// 用户自己定义操作，提供给子类继承
self.setup();

// 储存实例
cachedInstances[self.uniqueId] = self;
```

#### Render

将 `this.element` 插入到文档流，默认插入到 document.body，可以通过 container 指定。

Render 这一步操作从 Initialize 中独立出来，因为有些组件在实例化的时候不希望操作 DOM，如果希望实例化的时候处理可在 setup 里调用 this.render()。

#### Destroy

组件销毁。将 widget 生成的 element 和事件都销毁。

### 事件代理

事件代理是 Widget 非常好用的特性，将所有的事件都代理到 `this.element` 上。这样可以使得对应的 DOM 内容有修改时，无需重新绑定，在 destroy 的时候也会销毁这些事件。

widget.initDelegates() 会在实例初始化时自动调用，这时会从 this.option('delegates') 中取得声明的代理事件，比如

```js
var MyWidget = Widget.extend({
    defaults: {
      delegates: {
        "dblclick": "open",
        "click .icon.doc": "select",
        "mouseover .date": "showTooltip"
      }
    },
    open: function() {
      ...
    },
    select: function() {
      ...
    },
    ...
});
```

delegates 中每一项的格式是："event selector": "callback"，当省略 selector 时，默认会将事件绑定到 this.element 上。callback 可以是字符串，表示当前实例上的方法名； 也可以直接传入函数。

delegates 中，支持 {{name}} 表达式，比如上面的代码，可以简化为：

```js
var MyWidget = Widget.extend({
  defaults: {
    iconCls: '.icon.doc',
    delegates: {
      "dblclick": "open",
      "click {{iconCls}}": "select",
      "mouseover .date": "showTooltip"
    }
  },
  ...
});
```
