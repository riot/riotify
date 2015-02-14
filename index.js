var through = require('through');
var riot = require('riot');
var preamble = "var riot = require('riot');\n";

skipStyle = function (str) {
  var re = /<style>[\s\S]*<\/style>/gm;
  return str.replace(re, '');
}

module.exports = function (file, o) {
  var opts = o;
  var content = '';

  return !file.match(/\.tag$/) ? through() : through(
    function (chunk) { // write
      content += chunk.toString();
    },
    function () { // end
      if (opts.skipStyle) content = skipStyle(content);
      this.queue(preamble + riot.compile(content, opts));
      this.emit('end');
    }
  );
};
