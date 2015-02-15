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
      content = riot.compile(content, opts);

      if (opts.exports) {
        content = content.replace(/riot\.tag\(/, 'var _X=[');
        content = content.replace(/\);?\s*$/, '];_X.name=_X[0];module.exports=_X');
      }
      else {
        content = preamble + content;
      }

      this.queue(content);
      this.emit('end');
    }
  );
};
