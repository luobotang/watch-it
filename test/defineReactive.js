const assert = require('assert')
const { defineReactive } = require('..')

describe('defineReactive', () => {
  it('定义响应属性', (done) => {
    const obj = {}
    defineReactive(obj, 'name', 'luobo')
    assert.equal(obj.name, 'luobo')
    setTimeout(() => obj.name = 'tang', 100)
    setTimeout(() => {
      assert.equal(obj.name, 'tang')
      done()
    }, 200)
  })
})
