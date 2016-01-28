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

  t.plan(6);
  p.pipe(concat(function (out) {
    t.is(out.length, 2, 'got two files as output');
    t.ok(out[0].id.match(/riot\.js$/), 'out.0 is riot.js');
    t.ok(out[0].source.match(/module.exports/), 'riot.js');
    t.ok(out[1].id.match(/todo\.tag$/), 'out.1 is todo.tag');
    t.ok(out[1].source.match(/var riot = require\('riot'\);/), 'require riot');
    t.ok(out[1].source.match(/riot.tag2\(.*todo/), 'compiled compile.tag');
  }));
});

test('compile-custom-ext', function (t) {
  var file = path.join(__dirname, 'customext.html');
  var p = moduleDeps();

  p.write({ transform: riotify, options: {ext: "html"} });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(6);
  p.pipe(concat(function (out) {
    t.is(out.length, 2, 'got two files as output');
    t.ok(out[0].id.match(/riot\.js$/), 'out.0 is riot.js');
    t.ok(out[0].source.match(/module.exports/), 'riot.js');
    t.ok(out[1].id.match(/customext\.html$/), 'out.1 is customext.html');
    t.ok(out[1].source.match(/var riot = require\('riot'\);/), 'require riot');
    t.ok(out[1].source.match(/riot.tag2\(.*customext/), 'compiled compile.tag');
  }));
});

test('compile-custom-ext-ignore', function (t) {
  var file = path.join(__dirname, 'todo.tag');
  var p = moduleDeps();

  p.write({ transform: riotify, options: {ext: "html"} });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(3);
  p.pipe(concat(function (out) {
    t.ok(out[0], 'got output element');
    t.ok(out[0].source.length, 'got output element with source');
    t.ok(out[0].source.match(/^<todo>/), 'skipped todo.tag');
  }));
});

test('module exports riot tag', function (t) {
  var file = path.join(__dirname, 'todo.tag');
  var p = moduleDeps();

  p.write({ transform: riotify });
  p.write({ file: file, id: file, entry: true });
  p.end();

  t.plan(1);
  p.pipe(concat(function (out) {
    t.ok(out[1].source.match(/module.exports = riot.tag2/), 'riot tag');
  }));
});
