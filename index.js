var through = require('through');
var riot = require('riot');

module.exports = function (file, o) {
  var opts = o;
  var content = '';

  return !file.match(/\.tag$/) ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      this.queue(riot.compile(content, opts));
      this.emit('end');
    }
  );
};
