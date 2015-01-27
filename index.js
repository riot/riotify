var through = require('through');
var riotCompiler = require('riot/compiler/compile');

module.exports = function (file, o) {
  var opts = o;
  var content = '';
  var reqriot = 'var riot = require(\'riot\');';

  return !file.match(/\.tag$/) ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      this.queue(reqriot + riotCompiler(content, opts));
      this.emit('end');
    }
  );
};
