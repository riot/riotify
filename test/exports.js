var test = require('tape');
var concat = require('concat-stream');
var moduleDeps = require('module-deps');
var path = require('path');
var riotify = require('../');

test('compile', function (t) {
  var file = path.join(__dirname, 'todo.tag');
  var p = moduleDeps();

  p.write({ transform: riotify, options: { exports: true } });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(7);
  p.pipe(concat(function (out) {
    t.is(out.length, 1, 'got one files as output');
    //console.log(out[0].source);
    t.ok(out[0].id.match(/todo\.tag$/), 'out.1 is todo.tag');
    t.ok(out[0].source.match(/\];_X.name=_X\[0\];module.exports=_X/), 'compile todo.tag end');

    var exports = eval(out[0].source);
    t.is(exports.name, 'todo', 'name=todo');
    t.is(exports[0], 'todo', 'exports.0=todo');
    t.ok(exports[1].match(/\<div/), 'exports.1=div');
    t.is(typeof exports[2], 'function', 'exports.2=function');
  }));
});
