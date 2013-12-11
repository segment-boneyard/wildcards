
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

    calls.should.eql([[], [1], [1,2]]);
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

      calls.should.eql([ [ 'user.login', 'tobi' ], [ 'user.signup', 'loki' ] ]);
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

      calls.should.eql([ [ 'user:tobi:signup', 'loki' ] ]);
    })
  })
})