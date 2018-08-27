const { nextTick } = require('./util')

const queue = []
let waiting = false

exports.queueWatcher = queueWatcher

function queueWatcher(watcher) {
  if (queue.indexOf(watcher) > -1) return

  queue.push(watcher)

  if (!waiting) {
    waiting = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  flushing = true

  for (i = 0; i < queue.length; i++) {
    watcher = queue[i]
    watcher.run()
  }
}
