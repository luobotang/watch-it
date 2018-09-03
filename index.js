const defineReactive = require('./src/defineReactive')
const Observer = require('./src/observer')
const Watcher = require('./src/watcher')

exports.defineReactive = defineReactive

exports.observe = Observer.observe

exports.watch = function (fn, cb, options) {
  new Watcher(fn, cb, options)
}
