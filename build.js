const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')

const inputOpts = {input: './index.js', plugins: [commonjs()]}
const outputIifeOpts = {file: './dist/watch-it.js', format: 'iife', name: 'WatchIt', exports: 'named'}
const outputCommonOpts = {file: './dist/watch-it.common.js', format: 'cjs', exports: 'named'}
const outputEsmOpts = {file: './dist/watch-it.es.js', format: 'esm', exports: 'named'}

build(outputIifeOpts)
build(outputCommonOpts)
build(outputEsmOpts)

function build(outputOpts) {
  rollup.rollup(inputOpts)
    .then(bundle => {
      return bundle.generate(outputOpts).then(() => bundle.write(outputOpts))
    })
    .catch(e => console.log(e))
}