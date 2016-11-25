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
    t.ok(out[0].source.match(/^<todo>/), 'skipped ignore.ext')
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
    t.ok(out[0].id.match(/riot\.js$/), 'out.0 is riot.js')
    t.ok(out[0].source.match(/module.exports/), 'riot.js')
    t.ok(out[1].id.match(/todo\.tag$/), 'out.1 is todo.tag')
    t.ok(out[1].source.match(/var riot = require\('riot'\);/), 'require riot')
    t.ok(out[1].source.match(/riot.tag2\(.*todo/), 'compiled compile.tag')
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
    t.ok(out[0].id.match(/riot\.js$/), 'out.0 is riot.js')
    t.ok(out[0].source.match(/module.exports/), 'riot.js')
    t.ok(out[1].id.match(/customext\.html$/), 'out.1 is customext.html')
    t.ok(out[1].source.match(/var riot = require\('riot'\);/), 'require riot')
    t.ok(out[1].source.match(/riot.tag2\(.*customext/), 'compiled compile.tag')
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
    t.ok(out[0].source.match(/^<todo>/), 'skipped todo.tag')
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
    t.ok(out[1].source.match(/module.exports = riot.tag2/), 'riot tag')
  }))
})
