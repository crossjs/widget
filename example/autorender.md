# 自动渲染
- order: 2

---
<style>
  .widget {
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>

> 通过在 HTML 代码结构中添加 data-widget 属性，然后在页尾执行 Widget.autoRender 方法(*依赖 seajs*)，可以实现页面组件的自动渲染。

### HTML

````html
<div id="example1" class="widget" data-widget="widget" data-widget-class-name="widget">我是一个组件</div>
````

### JavaScript

````javascript
var Widget = require('./widget');
Widget.autoRender(function() {
  var example1 = Widget.get('#example1');

  example1.element.html('我是');

});
````
