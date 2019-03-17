const through = require('through')
const { compile } = require('@riotjs/compiler')

function inlineSourcemap(map) {
  return `\n//# sourceMappingURL=${Buffer.from(JSON.stringify(map)).toString('base64')}`
}

module.exports = function riotify(file, o) {
  const opts = o || {}
  const ext = opts.ext || 'riot'
  const enableSourceMap = Boolean(opts._flags.debug)
  const content = []

  return !file.match(`.${ext}$`) ? through() : through(
    chunk => content.push(chunk.toString()),
    function() { // end
      try {
        const { code, map } = compile(content.join(''), {...opts, file})
        this.queue(`${code}${enableSourceMap ? inlineSourcemap(map) : ''}`)
        this.emit('end')
      } catch (e) {
        this.emit('error', e)
      }
    }
  )
}
