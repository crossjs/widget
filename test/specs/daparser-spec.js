var $ = require('jquery');
var daParser = require('../../src/lib/daparser');

describe('daparser', function() {
  it('single data-widget-xx', function() {
    var div = $('<div data-widget-key="test"></div>').appendTo('body');
    var dataset = daParser(div[0]);

    expect(dataset.key).to.be('test');
  });

  it('multi data-widget-xx', function() {
    var div = $('<div data-widget-key="test" data-widget-key1="test1" data-widget-key2="true" data-widget-key3="false"></div>').appendTo('body');
    var dataset = daParser(div[0]);

    expect(dataset.key).to.be('test');
    expect(dataset['key1']).to.be('test1');
    expect(dataset.key2).to.be(true);
    expect(dataset.key3).to.be(false);
  });

  it('convert dash-name to camelCasedName', function() {
    var div = $('<div data-widget-x-y-123a-_B="val" data-widget-x-y="val" data-widget-AbcD-x="val"></div>').appendTo('body');
    var dataset = daParser(div[0]);

    //equal(dataset['xY-123a-_b'], 'val', '');
    expect(dataset['xY']).to.be('val');
    expect(dataset['abcdX']).to.be('val');

  });

  it('table element', function() {
    var table = $('<table><tr><td data-widget-x="1"></td></tr></table>').appendTo('body')
    var dataset = daParser(table.find('td')[0]);

    expect(dataset['x']).to.be(1);
  })

  it('object', function() {
    var div = $('<div data-widget-object="{\'a\':\'a\', \'b\':1}"></div>').appendTo('body');
    var dataset = daParser(div[0]);
    var dataset2 = daParser(div[0], true);

    expect(dataset['object']).to.eql({
      'a':'a',
      'b': 1
    });
    expect(dataset2['object']).to.be('{\'a\':\'a\', \'b\':1}');
  })

});
