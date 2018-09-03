const Dep = require('./dep')
const Watcher = require('./watcher')

const noop = () => {}
const computedWatcherOptions = { lazy: true }
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

module.exports = function (target, key, userDef) {
  let watchers
  if (!target.hasOwnProperty('__computed_watchers__')) {
    watchers = Object.create(null)
    Object.defineProperty(target, '__computed_watchers__', {
      value: watchers,
      enumerable: false,
      writable: true,
      configurable: true
    })
  } else {
    watchers = target.__computed_watchers__
  }
  const getter = typeof userDef === 'function' ? userDef : userDef.get
  watchers[key] = new Watcher(
    getter || noop,
    noop,
    computedWatcherOptions
  )
  defineComputed(target, key, userDef)
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get ? createComputedGetter(key) : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this.__computed_watchers__ && this.__computed_watchers__[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}