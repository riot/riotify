var test = require('tape');
var concat = require('concat-stream');
var moduleDeps = require('module-deps');
var path = require('path');
var riotify = require('../');

test('ignore', function (t) {
  var file = path.join(__dirname, 'ignore.ext');
  var p = moduleDeps();

  p.write({ transform: riotify, options: {} });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(3);
  p.pipe(concat(function (out) {
    t.ok(out[0], 'got output element');
    t.ok(out[0].source.length, 'got output element with source');
    t.ok(out[0].source.match(/^<todo>/), 'skipped ignore.ext');
  }));
});

test('compile', function (t) {
  var file = path.join(__dirname, 'todo.tag');
  var p = moduleDeps();

  p.write({ transform: riotify, options: {} });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(3);
  p.pipe(concat(function (out) {
    t.ok(out[0], 'got output element');
    t.ok(out[0].source.length, 'got output element with source');
    t.ok(out[0].source.match(/^riot.tag\(.*todo/), 'compiled compile.tag');
  }));
});
