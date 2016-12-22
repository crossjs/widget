# 基本操作

---
<style>
  .widget {
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>
## 事件委托

### html

````html
<div id="example1" class="example widget"></div>

````
### javascript

````javascript
var Widget = require('./widget');
var MyWidget = Widget.extend({
  defaults: {
    element: '#example1',
    container: null,
    content: '<h3>这是一个组件</h3><a href="javascirpt:;" data-role="hello">点我点我点我</a>',
    delegates: {
      'mouseenter': function() {
        this.$('h3').css('color', '#f66');
      },
      'mouseleave': function() {
        this.$('h3').css('color', '#666');
      },
      'click [data-role=hello]': function() {
        alert('你已点击了！');
      }
    }
  },
  setup: function() {
    this.render();
  }
});
new MyWidget();
````
