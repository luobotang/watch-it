const assert = require('assert')
const { watch, observe } = require('../')

runTask(() => {
  const data = {name: 'luobo'}

  observe(data)

  watch(() => data.name + ' here!', (val, oldVal) => {
    assert.equal(oldVal, 'luobo here!')
    assert.equal(val, 'tang here!')
    console.log('task 1 - ok')
  })

  data.name = 'tang'
})

runTask(() => {
  const data = {name: 'luobo'}

  observe(data)

  function render() {
    const html = `<div class="demo">${data.name}</div>`
    console.log('rendered:', html)
    return html
  }

  watch(render, () => {
    console.log('task 2 - ok')
  })

  data.name = 'tang'
})

function runTask(task) {
  task()
}