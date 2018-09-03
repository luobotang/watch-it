const defineReactive = require('./src/defineReactive')
const defineComputed = require('./src/defineComputed')
const Observer = require('./src/observer')
const Watcher = require('./src/watcher')

exports.defineReactive = defineReactive
exports.observe = Observer.observe

exports.defineComputed = defineComputed

exports.watch = function (fn, cb, options) {
  const watcher = new Watcher(fn, cb, options)
  return () => watcher.teardown() // unwatch
}
