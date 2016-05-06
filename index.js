var through = require('through');
var riot = require('riot');
var preamble = "var riot = require('riot');\n";

module.exports = function (file, o) {
  var opts = o || {};
  var ext = opts.ext || 'tag';
  var content = '';

  return !file.match('\.' + ext + '$') ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      try {
        this.queue(preamble + 'module.exports = ' + riot.compile(content, opts, file));
        this.emit('end');
      } catch (e) {
        this.emit('error', e);
      }
    }
  );
};
