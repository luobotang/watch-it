const assert = require('assert')
const { defineComputed, observe } = require('..')

describe('defineComputed', () => {
  it('创建计算属性', () => {
    const data = {a: 1, b: 2}
    observe(data)

    defineComputed(data, 'c', () => data.a + data.b)
    assert.equal(data.c, 3)

    data.a = 10
    assert.equal(data.c, 12)
  })

  it('懒计算', () => {
    const data = {a: 1, b: 2}
    observe(data)

    let count = 0
    defineComputed(data, 'c', () => {
      count++
      return data.a + data.b
    })

    data.a = 10
    data.a = 20
    data.a = 30
    data.a = 40
    data.a = 50

    assert.equal(data.c, 52)
    assert.equal(count, 1)
  })
})