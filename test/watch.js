const assert = require('assert')
const { watch, observe } = require('..')

describe('observe', () => {
  it('定义 Observer', () => {
    const data = {name: 'luobo'}
    observe(data)
    assert(data.__ob__)
  })
})

describe('watch', () => {
  it('监听数据变化', (done) => {
    const data = {name: 'luobo'}
    observe(data)

    watch(() => data.name + ' here!', (val, oldVal) => {
      assert.equal(oldVal, 'luobo here!')
      assert.equal(val, 'tang here!')
      done()
    })

    data.name = 'tang'
  })
})