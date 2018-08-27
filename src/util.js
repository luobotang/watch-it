const callbacks = []
let pending = false

let timerFunc

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  copies.forEach((cb) => cb())
}

exports.nextTick = function (cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    timerFunc()
  }
}
