const Dep = require('./dep')

module.exports = function defineReactive(obj, key, val) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) return

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 建立依赖关系
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      val = newVal
      // 通知更新
      dep.notify()
    }
  })
}