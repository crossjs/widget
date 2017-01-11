var Widget = require('../src');

var WidgetA = Widget.extend({
  defaults: {
    data: {
      list: [{
        name: 'lxx',
        sex: 1
      }, {
        name: 'xxxd',
        sex: 0
      }]
    },
    template: require('./widget.handlebars'),
    templateOptions: {
      helpers: {
        desp: function() {
          return this.name + (this.sex === 1 ? '男' : '女')
        }
      },
      partials: {
        item: require('./item.handlebars')
      }
    }
  },
  setup: function() {
    this.render();
  }
});
var widgetA = new WidgetA({

});
