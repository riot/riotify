var through = require('through');
var riot = require('riot');
var preamble = "var riot = require('riot');\n";

module.exports = function (file, o) {
  var opts = o;
  var content = '';
  var ext = o.ext || 'tag';

  return !file.match('\.' + ext + '$') ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      this.queue(preamble + riot.compile(content, opts));
      this.emit('end');
    }
  );
};
