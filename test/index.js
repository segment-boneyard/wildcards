
var Emitter = require('events').EventEmitter;
var wildcards = require('..');

describe('wildcards(emitter, fn)', function(){
  it('should subscribe to all events', function(){
    var e = new Emitter;
    var calls = [];

    wildcards(e, function(){
      calls.push([].slice.call(arguments));
    });

    e.emit('foo');
    e.emit('bar', 1);
    e.emit('baz', 1, 2);

    calls.should.eql([ [ 'foo' ], [ 'bar', 1 ], [ 'baz', 1, 2 ]]);
  })
})