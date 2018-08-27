const Observer = require('./src/observer')
const Watcher = require('./src/watcher')

exports.observe = Observer.observe

exports.watch = function (fn, cb, options) {
  new Watcher(fn, cb, options)
}
