const test = require('tape')
const concat = require('concat-stream')
const moduleDeps = require('module-deps')
const path = require('path')
const riotify = require('../')

test('ignore', t => {
  const file = path.join(__dirname, 'ignore.ext')
  const p = moduleDeps()

  p.write({ transform: riotify, options: {} })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(3)
  p.pipe(concat(out => {
    t.ok(out[0], 'got output element')
    t.ok(out[0].source.length, 'got output element with source')
    t.ok(/^<todo>/.test(out[0].source), 'skipped ignore.ext')
  }))
})

test('compile', t => {
  const file = path.join(__dirname, 'todo.tag')
  const p = moduleDeps()

  p.write({ transform: riotify, options: {} })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(6)
  p.pipe(concat(out => {
    t.is(out.length, 2, 'got two files as output')
    t.ok(/riot\.js$/.test(out[0].id), 'out.0 is riot.js')
    t.ok(/IS_DIRECTIVE/.test(out[0].source), 'riot.js')
    t.ok(/todo\.tag$/.test(out[1].id), 'out.1 is todo.tag')
    t.ok(/var riot = require\('riot'\);/.test(out[1].source), 'require riot')
    t.ok(/riot\.tag2\(.*todo/.test(out[1].source), 'compiled compile.tag')
  }))
})

test('compile-custom-ext', t => {
  const file = path.join(__dirname, 'customext.html')
  const p = moduleDeps()

  p.write({ transform: riotify, options: {ext: 'html'} })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(6)
  p.pipe(concat(out => {
    t.is(out.length, 2, 'got two files as output')
    t.ok(/riot\.js$/.test(out[0].id), 'out.0 is riot.js')
    t.ok(/IS_DIRECTIVE/.test(out[0].source), 'riot.js')
    t.ok(/customext\.html$/.test(out[1].id), 'out.1 is customext.html')
    t.ok(/var riot = require\('riot'\);/.test(out[1].source), 'require riot')
    t.ok(/riot.tag2\(.*customext/.test(out[1].source), 'compiled compile.tag')
  }))
})

test('compile-custom-ext-ignore', t => {
  const file = path.join(__dirname, 'todo.tag')
  const p = moduleDeps()

  p.write({ transform: riotify, options: {ext: 'html'} })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(3)
  p.pipe(concat(out => {
    t.ok(out[0], 'got output element')
    t.ok(out[0].source.length, 'got output element with source')
    t.ok(/^<todo>/.test(out[0].source), 'skipped todo.tag')
  }))
})

test('module exports riot tag', t => {
  const file = path.join(__dirname, 'todo.tag')
  const p = moduleDeps()

  p.write({ transform: riotify })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(1)
  p.pipe(concat(out => {
    t.ok(/module.exports = riot.tag2/.test(out[1].source), 'riot tag')
  }))
})

test('force sourcemaps', t => {
  const file = path.join(__dirname, 'todo.tag')
  const p = moduleDeps()

  p.write({ transform: riotify, options: { sourceMaps: true } })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(1)
  p.pipe(concat(out => {
    t.ok(/\/\/# sourceMappingURL=/.test(out[1].source), 'sourcemaps comment')
  }))
})

test('disable sourcemaps', t => {
  const file = path.join(__dirname, 'todo.tag')
  const p = moduleDeps()

  p.write({ transform: riotify, options: { sourceMaps: false } })
  p.write({ file, id: file, entry: true })
  p.end()

  t.plan(1)
  p.pipe(concat(out => {
    t.notOk(/\/\/# sourceMappingURL=/.test(out[1].source), 'no sourcemaps comment')
  }))
})

