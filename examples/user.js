
var Emitter = require('events').EventEmitter;
var events = require('..');

var app = new Emitter;

events(app, 'user:*', function(event, user){
  console.log('  %s %s', event, user);
});

app.emit('foo');
app.emit('bar');
app.emit('user:logout', 'tobi');
app.emit('user:login', 'loki');
app.emit('user:login', 'jane');