const { pushTarget, popTarget } = require('./dep')
const { queueWatcher } = require('./scheduler')

let uid = 0

module.exports = class Watcher {
  constructor(getter, cb, options) {
    if (options) {
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.lazy = this.sync = false
    }

    this.cb = cb
    this.uid = ++uid
    this.active = true
    this.dirty = this.lazy
    this.deps = []
    this.newDeps = []
    this.getter = getter
    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    pushTarget(this)
    let value = this.getter.call(null)
    popTarget(this)
    this.cleanupDeps()
    return value
  }

  addDep(dep) {
    if (this.newDeps.indexOf(dep) > -1) return
    this.newDeps.push(dep)

    if (this.deps.indexOf(dep) === -1) {
      dep.addSub(this)
    }
  }

  cleanupDeps() {
    // 解除老的依赖关系
    this.deps.forEach((dep) => {
      if (this.newDeps.indexOf(dep) === -1) {
        dep.removeSub(this)
      }
    })

    // 重新设置依赖关系
    this.deps = this.newDeps
    this.newDeps = []
  }

  // 依赖更新时被调用
  update() {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  run() {
    if (!this.active) return
    const value = this.get()
    const oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(null, value, oldValue)
    }
  }

  // 只会被 lazy watcher 调用
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  // 依赖所有的 dep
  depend() {
    this.deps.forEach((dep) => {
      dep.depend()
    })
  }

  // 解除所有的依赖关系
  teardown() {
    if (!this.active) return
    this.deps.forEach((dep) => {
      dep.removeSub(this)
    })
    this.active = false
  }
}