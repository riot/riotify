const through = require('through')
const { transformSync } = require('@babel/core')
const pluginCJS = require('@babel/plugin-transform-modules-commonjs')
const { compile } = require('@riotjs/compiler')

module.exports = function riotify(file, o) {
  const opts = o || {}
  const ext = opts.ext || 'riot'
  const enableSourceMap = Boolean(opts._flags.debug)
  const content = []

  return !file.match(`.${ext}$`) ? through() : through(
    chunk => content.push(chunk.toString()),
    function() {
      try {
        const result = compile(content.join(''), {...opts, file})
        const { code } = transformSync(result.code, {
          inputSourceMap: result.map,
          sourceMaps: enableSourceMap ? 'inline' : false,
          babelrc: false,
          filename: file,
          plugins: [pluginCJS]
        })

        this.queue(code)
        this.emit('end')
      } catch (e) {
        this.emit('error', e)
      }
    }
  )
}
