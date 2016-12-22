var Widget = require('../src');

var WidgetA = Widget.extend({
});
var widgetA = new WidgetA({
  classPrefix: 'ue-test',
  trigger: '#btn2'
});
widgetA.render();
