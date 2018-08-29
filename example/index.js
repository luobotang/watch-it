var vm = {
  el: document.querySelector('#root'),
  data: {
    name: 'luobo',
    age: 18
  },
  init() {
    WatchIt.observe(this.data)
    WatchIt.watch(() => this.updateView(), () => {})
    this.initEvents()
  },
  initEvents() {
    this.el.addEventListener('click', (e) => {
      var target = e.target
      if (target.tagName === 'BUTTON') {
        if (target.textContent === '+') {
          this.data.age++
        } else {
          this.data.age--
        }
      }
    }, false)
  },
  updateView() {
    console.log('updateView')
    this.el.innerHTML = this.render()
  },
  render() {
    const data = this.data
    return `${data.name} - ${data.age} <button>+</button> <button>-</button>`
  }  
}

vm.init()