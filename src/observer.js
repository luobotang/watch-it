const Dep = require('./dep')
const defineReactive = require('./defineReactive')

class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
    this.walk(value)
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
}

Observer.observe = function(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  let ob
  if (value.hasOwnProperty( '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

module.exports = Observer