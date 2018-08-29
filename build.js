const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')

const inputOpts = {input: './index.js', plugins: [commonjs()]}
const outputOpts = {file: './dist/watch-it.js', format: 'iife', name: 'WatchIt', exports: 'named'}

rollup.rollup(inputOpts)
  .then(bundle => {
    return bundle.generate(outputOpts).then(() => bundle.write(outputOpts))
  })
  .catch(e => console.log(e))
