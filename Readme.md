# wildcards

  Wildcard event-emitter proxy for nodejs.

## Installation

```
$ npm install wildcards
$ component install segmentio/wildcards
```

## Example

```js
var Emitter = require('events').EventEmitter;
var events = require('wildcards');

var app = new Emitter;

events(app, 'user:*', function(event, user){
  console.log('  %s %s', event, user);
});

app.emit('foo');
app.emit('bar');
app.emit('user:logout', 'tobi');
app.emit('user:login', 'loki');
app.emit('user:login', 'jane');
```

 Yielding:

```
user:logout tobi
user:login loki
user:login jane
```

# License

  MIT
