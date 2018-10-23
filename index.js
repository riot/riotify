'use strict'

const through = require('through')
const compiler = require('riot-compiler')
const preamble = "var riot = require('riot');\n"

module.exports = function riotify (file, o) {
  const opts = o || {}
  const ext = opts.ext || 'tag'
  const enableSourceMaps = typeof opts.sourceMaps === 'boolean' ? opts.sourceMaps : opts._flags.debug

  opts.sourcemap = enableSourceMaps ? 'inline' : false

  let content = ''

  return !file.match(`\.${ ext }$`) ? through() : through(
    function (chunk) { // write
      content += chunk.toString()
    },
    function () { // end
      try {
        const compiled = compiler.compile(content, opts, file)
        this.queue(`${ preamble }module.exports = ${ compiled }`)
        this.emit('end')
      } catch (e) {
        this.emit('error', e)
      }
    }
  )
}
