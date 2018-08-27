let uid = 0
const targetStack = []

class Dep {
  constructor() {
    this.id = ++uid
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  removeSub(watcher) {
    const i = this.subs.indexOf(watcher)
    if (i === -1) return
    this.subs.splice(i, 1)
  }

  depend() {
    if (!Dep.target) return
    Dep.target.addDep(this)
  }

  notify() {
    this.subs.forEach((watcher) => {
      watcher.update()
    })
  }
}

Dep.target = null // watcher
Dep.pushTarget = pushTarget
Dep.popTarget = popTarget

module.exports = Dep

function pushTarget(watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = watcher
}

function popTarget() {
  Dep.target = targetStack.pop()
}
