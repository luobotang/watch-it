const assert = require('assert')
const { watch, observe, defineComputed } = require('..')

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

  it('异步更新', (done) => {
    const data = {name: 'luobo'}
    observe(data)

    let count = 0
    watch(() => data.name, () => count++)

    data.name = '1'
    data.name = '2'
    data.name = '3'
    data.name = '4'

    setTimeout(() => {
      assert.equal(count, 1)
      done()
    })
  })

  it('unwatch', (done) => {
    const data = {name: 'luobo'}
    observe(data)

    let count = 0

    const unwatch = watch(() => data.name, () => count++)

    data.name = 'tang'
    setTimeout(() => assert.equal(count, 1))

    setTimeout(() => unwatch(), 100)
    setTimeout(() => {
      assert.equal(count, 1)
      done()
    }, 200)
  })

  it('依赖计算属性', (done) => {
    const data = {name: 'luobo'}
    observe(data)

    defineComputed(data, 'fullname', () => data.name + ' tang')

    watch(() => `<div>${data.fullname}</div>`, (html) => {
      assert.equal(html, '<div>tom tang</div>')
      done()
    })

    data.name = 'tom'
  })
})