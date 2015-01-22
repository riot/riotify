var through = require('through');
var riotCompiler = require('riot/compiler');

module.exports = function (file, o) {
  var opts = o;
  var content = '';

  return !file.match(/\.tag$/) ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      this.queue(riotCompiler(content, opts));
      this.emit('end');
    }
  );
};
