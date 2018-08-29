var WatchIt = (function (exports) {
  'use strict';

  let uid = 0;
  const targetStack = [];

  class Dep {
    constructor() {
      this.id = ++uid;
      this.subs = [];
    }

    addSub(watcher) {
      this.subs.push(watcher);
    }

    removeSub(watcher) {
      const i = this.subs.indexOf(watcher);
      if (i === -1) return
      this.subs.splice(i, 1);
    }

    depend() {
      if (!Dep.target) return
      Dep.target.addDep(this);
    }

    notify() {
      this.subs.forEach((watcher) => {
        watcher.update();
      });
    }
  }

  Dep.target = null; // watcher
  Dep.pushTarget = pushTarget;
  Dep.popTarget = popTarget;

  var dep = Dep;

  function pushTarget(watcher) {
    if (Dep.target) targetStack.push(Dep.target);
    Dep.target = watcher;
  }

  function popTarget() {
    Dep.target = targetStack.pop();
  }

  var defineReactive = function defineReactive(obj, key, val) {
    const dep$$1 = new dep();

    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) return

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        // 建立依赖关系
        if (dep.target) {
          dep$$1.depend();
        }
        return val
      },
      set: function reactiveSetter(newVal) {
        if (newVal === val) return
        val = newVal;
        // 通知更新
        dep$$1.notify();
      }
    });
  };

  class Observer {
    constructor(value) {
      this.value = value;
      this.dep = new dep();
      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        writable: true,
        configurable: true
      });
      this.walk(value);
    }

    walk(obj) {
      Object.keys(obj).forEach((key) => {
        defineReactive(obj, key, obj[key]);
      });
    }
  }

  Observer.observe = function(value) {
    if (!value || typeof value !== 'object') {
      return
    }
    let ob;
    if (value.hasOwnProperty( '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else {
      ob = new Observer(value);
    }
    return ob
  };

  var observer = Observer;

  const callbacks = [];
  let pending = false;

  let timerFunc;

  if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = () => {
      p.then(flushCallbacks);
    };
  } else {
    timerFunc = () => {
      setTimeout(flushCallbacks, 0);
    };
  }

  function flushCallbacks () {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    copies.forEach((cb) => cb());
  }

  var nextTick = function (cb) {
    callbacks.push(cb);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  };

  var util = {
  	nextTick: nextTick
  };

  const { nextTick: nextTick$1 } = util;

  const queue = [];
  let waiting = false;

  var queueWatcher_1 = queueWatcher;

  function queueWatcher(watcher) {
    if (queue.indexOf(watcher) > -1) return

    queue.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick$1(flushSchedulerQueue);
    }
  }

  function flushSchedulerQueue() {
    for (let i = 0; i < queue.length; i++) {
      let watcher = queue[i];
      watcher.run();
    }
    waiting = false;
    queue.length = 0;
  }

  var scheduler = {
  	queueWatcher: queueWatcher_1
  };

  const { pushTarget: pushTarget$1, popTarget: popTarget$1 } = dep;
  const { queueWatcher: queueWatcher$1 } = scheduler;

  let uid$1 = 0;

  var watcher = class Watcher {
    constructor(getter, cb, options) {
      if (options) {
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
      } else {
        this.lazy = this.sync = false;
      }

      this.cb = cb;
      this.uid = ++uid$1;
      this.active = true;
      this.dirty = this.lazy;
      this.deps = [];
      this.newDeps = [];
      this.getter = getter;
      this.value = this.lazy ? undefined : this.get();
    }

    get() {
      pushTarget$1(this);
      let value = this.getter.call(null);
      popTarget$1(this);
      this.cleanupDeps();
      return value
    }

    addDep(dep$$1) {
      if (this.newDeps.indexOf(dep$$1) > -1) return
      this.newDeps.push(dep$$1);

      if (this.deps.indexOf(dep$$1) === -1) {
        dep$$1.addSub(this);
      }
    }

    cleanupDeps() {
      // 解除老的依赖关系
      this.deps.forEach((dep$$1) => {
        if (this.newDeps.indexOf(dep$$1) === -1) {
          dep$$1.removeSub(this);
        }
      });

      // 重新设置依赖关系
      this.deps = this.newDeps;
      this.newDeps = [];
    }

    // 依赖更新时被调用
    update() {
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync) {
        this.run();
      } else {
        queueWatcher$1(this);
      }
    }

    run() {
      if (!this.active) return
      const value = this.get();
      const oldValue = this.value;
      if (value !== oldValue) {
        this.value = value;
        this.cb.call(null, value, oldValue);
      }
    }

    // 只会被 lazy watcher 调用
    evaluate() {
      this.value = this.get();
      this.dirty = false;
    }

    // 依赖所有的 dep
    depend() {
      this.deps.forEach((dep$$1) => {
        dep$$1.depend();
      });
    }

    // 解除所有的依赖关系
    teardown() {
      if (!this.active) return
      this.deps.forEach((dep$$1) => {
        dep$$1.removeSub(this);
      });
      this.active = false;
    }
  };

  var observe = observer.observe;

  var watch = function (fn, cb, options) {
    new watcher(fn, cb, options);
  };

  var watchIt = {
  	observe: observe,
  	watch: watch
  };

  exports.default = watchIt;
  exports.observe = observe;
  exports.watch = watch;

  return exports;

}({}));
