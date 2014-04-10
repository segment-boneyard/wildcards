
/**
 * Module dependencies.
 */

var escape = require('escape-regexp');

/**
 * Expose `wildcards`.
 */

module.exports = wildcards;

/**
 * Listen for events on `emitter`
 * with optional `pattern`.
 *
 * @param {Emitter} emitter
 * @param {String|Function} [pattern or callback]
 * @param {Function} [callback]
 * @api public
 */

function wildcards(e, pattern, fn) {
  // optional pattern
  if ('function' == typeof pattern) {
    fn = pattern;
    pattern = '*';
  }

  // create regexp
  pattern = escape(pattern);
  pattern = pattern.replace(/\\[*]/g, '(.*?)');
  var re = new RegExp('^' + pattern + '$');

  // proxy .emit()
  var emit = e.emit;
  e.emit = function(event){
    emit.apply(e, arguments);
    if (!re.test(event)) return;
    fn.apply(null, arguments);
    return e;
  };
}
