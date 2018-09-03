class Vue {
  constructor(options) {
    this.el = options.el
    this.options = options
    this.init()
  }

  init() {
    this.initData()
    this.initComputed()
    this.initRender()
    this.initEvents()
  }

  initData() {
    const data = this.options.data || {}
    WatchIt.observe(data)
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() { return data[key] },
        set(val) { data[key] = val }
      })
    })
  }

  initComputed() {
    const computed = this.options.computed || {}
    Object.keys(computed).forEach((key) => {
      WatchIt.defineComputed(this, key, () => computed[key].call(this))
    })
  }

  initRender() {
    WatchIt.watch(() => this.updateView(), () => {})
  }

  initEvents() {
    const events = this.options.events
    const eventCallbacks = this._events = {}
    Object.keys(events).forEach((selector) => {
      const elEvents = events[selector]
      Object.keys(elEvents).forEach((name) => {
        const handler = elEvents[name]
        const cbs = eventCallbacks[name] || (eventCallbacks[name] = createEventHandler(this.el, name))
        cbs.push((e) => e.target.matches(selector) && handler.call(this, e))
      })
    })

    function createEventHandler(el, event) {
      const cbs = []
      el.addEventListener(event, (e) => {
        cbs.forEach(cb => cb(e))
      })
      return cbs
    }
  }

  updateView() {
    this.el.innerHTML = this.options.render.call(this)
  }
}