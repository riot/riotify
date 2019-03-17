const { expect } = require('chai')
const concat = require('concat-stream')
const moduleDeps = require('module-deps')
const path = require('path')
const riotify = require('../')


describe('riotify', () => {
  it('ignore', (done) => {
    const file = path.join(__dirname, 'ignore.ext')
    const p = moduleDeps()

    p.write({ transform: riotify, options: {} })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(out[0], 'got output element').to.be.ok
      expect(out[0].source.length, 'got output element with source').to.be.ok
      expect(/^<todo>/.test(out[0].source), 'skipped ignore.ext').to.be.ok
      done()
    }))
  })

  it('compile', (done) => {
    const file = path.join(__dirname, 'todo.riot')
    const p = moduleDeps()

    p.write({ transform: riotify, options: {} })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(out).to.have.length(1)
      expect(/var _default = {/.test(out[0].source)).to.be.ok
      done()
    }))
  })

  it('compile-custom-ext', (done) => {
    const file = path.join(__dirname, 'customext.html')
    const p = moduleDeps()

    p.write({ transform: riotify, options: {ext: 'html'} })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(out).to.have.length(1)
      expect(/customext\.html$/.test(out[0].id), 'out.1 is customext.html').to.be.ok
      expect(/var _default = {/.test(out[0].source)).to.be.ok
      done()
    }))
  })

  it('compile-custom-ext-ignore', (done) => {
    const file = path.join(__dirname, 'todo.riot')
    const p = moduleDeps()

    p.write({ transform: riotify, options: {ext: 'html'} })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(out[0], 'got output element').to.be.ok
      expect(out[0].source.length, 'got output element with source').to.be.ok
      expect(/^<todo>/.test(out[0].source), 'skipped todo.riot').to.be.ok
      done()
    }))
  })

  it('module exports riot tag', (done) => {
    const file = path.join(__dirname, 'todo.riot')
    const p = moduleDeps()

    p.write({ transform: riotify })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(/var _default = {/.test(out[0].source)).to.be.ok
      done()
    }))
  })

  it('force sourcemap', (done) => {
    const file = path.join(__dirname, 'todo.riot')
    const p = moduleDeps({ debug: true })

    p.write({ transform: riotify})
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(/\/\/# sourceMappingURL=/.test(out[0].source), 'sourcemaps comment').to.be.ok
      done()
    }))
  })

  it('disable sourcemap', (done) => {
    const file = path.join(__dirname, 'todo.riot')
    const p = moduleDeps({ debug: false })

    p.write({ transform: riotify })
    p.write({ file, id: file, entry: true })
    p.end()

    p.pipe(concat(out => {
      expect(/\/\/# sourceMappingURL=/.test(out[0].source), 'no sourcemaps comment').to.be.not.ok
      done()
    }))
  })
})


