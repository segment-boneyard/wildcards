
try {
  var Emitter = require('events').EventEmitter;
  var wildcards = require('..');
  var assert = require('assert');
} catch (e) {
  var Emitter = require('emitter');
  var wildcards = require('wildcards');
  var assert = require('assert');
}

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

    assert.deepEqual(calls, [ [ 'foo' ], [ 'bar', 1 ], [ 'baz', 1, 2 ]]);
  })

  it('should not break .on()', function(){
    var e = new Emitter;
    var calls = [];

    wildcards(e, function(){

    });

    e.on('foo', function(){
      calls.push([].slice.call(arguments));
    });

    e.on('bar', function(){
      calls.push([].slice.call(arguments));
    });

    e.on('baz', function(){
      calls.push([].slice.call(arguments));
    });

    e.emit('foo');
    e.emit('bar', 1);
    e.emit('baz', 1, 2);

    assert.deepEqual(calls, [[], [1], [1,2]]);
  })

  it('should not break .emit()', function(){
    var e = new Emitter;
    var calls = [];

    wildcards(e, 'user.*', function(){
      calls.push([].slice.call(arguments));
    });

    e.on('foo', function(){
      calls.push([].slice.call(arguments));
    });

    e.emit('foo', 1);
    e.emit('user.login', 'tobi');

    assert.deepEqual(calls, [ [1], [ 'user.login', 'tobi' ] ]);
  })

  it('should chain', function(){
    var e = new Emitter;
    var calls = 0;
    wildcards(e, 'user.*', function(){
      calls++
    });

    e.emit('user.blah').emit('user.foo');
    assert(2 == calls);
  })
})

describe('wildcards(emitter, pattern, fn)', function(){
  describe('*', function(){
    it('should subscribe using a pattern', function(){
      var e = new Emitter;
      var calls = [];

      wildcards(e, 'user.*', function(){
        calls.push([].slice.call(arguments));
      });

      e.emit('foo');
      e.emit('bar', 1);
      e.emit('baz', 1, 2);
      e.emit('user.login', 'tobi');
      e.emit('user.signup', 'loki');

      assert.deepEqual(calls, [ [ 'user.login', 'tobi' ], [ 'user.signup', 'loki' ] ]);
    })

    it('should work with postfix segments', function(){
      var e = new Emitter;
      var calls = [];

      wildcards(e, 'user:*:signup', function(){
        calls.push([].slice.call(arguments));
      });

      e.emit('foo');
      e.emit('bar', 1);
      e.emit('baz', 1, 2);
      e.emit('user.login', 'tobi');
      e.emit('user:tobi:signup', 'loki');
      e.emit('user.foo.bar.baz', 'loki');

      assert.deepEqual(calls, [ [ 'user:tobi:signup', 'loki' ] ]);
    })

    it('should match across segments', function(){
      var e = new Emitter;
      var calls = [];

      wildcards(e, 'user:*', function(){
        calls.push([].slice.call(arguments));
      });

      e.emit('foo');
      e.emit('bar', 1);
      e.emit('baz', 1, 2);
      e.emit('user.login', 'tobi');
      e.emit('user:tobi:signup', 'loki');
      e.emit('user:tobi:login', 'loki');

      assert.deepEqual(calls, [
        [ 'user:tobi:signup', 'loki' ],
        [ 'user:tobi:login', 'loki' ]
      ]);
    })
  })
})
