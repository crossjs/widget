var $ = require('jquery');
var daParser = require('../../src/lib/daparser');

describe('daparser-ancient', function() {
  it('single data-widget-xx', function() {
    var div = {
      attributes: [
        {
          name: 'data-widget-key',
          value: 'test'
        },
        {
          name: 'style',
          value: 'test'
        }
      ]
    };
    var dataset = daParser(div);
    expect(dataset.key).to.be('test');
    expect(dataset.style).to.be(undefined);
  });

  it('multi data-widget-xx', function() {
    var div = {
      attributes: [
        {
          name: 'data-widget-key',
          value: 'test'
        },
        {
          name: 'data-widget-key1',
          value: 'test1'
        },
        {
          name: 'style',
          value: 'test'
        }
      ]
    };
    var dataset = daParser(div);

    expect(dataset.key).to.be('test');
    expect(dataset['key1']).to.be('test1')

  });

  it('convert dash-name to camelCasedName', function() {
    var div = {
      attributes: [
        {
          // 不作处理
          name: 'data-widget-x-y-123a-_B',
          value: 'val'
        },
        {
          name: 'data-widget-x-y',
          value: 'val'
        },
        {
          name: 'data-widget-AbcD-x',
          value: 'val'
        }
      ]
    };
    var dataset = daParser(div);

    expect(dataset['xY-123a-_b']).to.be('val');
    expect(dataset['xY']).to.be('val');
    expect(dataset['abcdX']).to.be('val');

  });

  it('object', function() {
    var div = {
      attributes: [
        {
          name: 'data-widget-object',
          value: '{\'a\':\'a\', \'b\':1}'
        }
      ]
    };
    var dataset = daParser(div);

    expect(dataset['object']).to.eql({
      'a': 'a',
      'b': 1
    });
  });

});
