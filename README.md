# riotify

[![Build Status][ci-image]][ci-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

"riotify" is a browserify transformer for [riot](https://github.com/riot/riot) ".riot" files.

## Important

If you are using Riot.js < 4.0.0 please check the [v3 branch](https://github.com/riot/riotify/tree/v3)

## Installation

```bash
$ npm install riotify @riotjs/compiler -D
```

## Usage

This module is meant to be used together with
[browserify](http://browserify.org) or
[module-deps](https://github.com/substack/module-deps):

Either of the two commands below result creates the same result:

```bash
$ browserify -t riotify app.js
$ module-deps -t riotify app.js | browser-pack
```

Example `app.js`:

```javascript
const Todo = require('./todo.riot').default
const {component} = require('riot')

component(Todo)(document.getElementById('todo'))
```

Example `todo.riot`:

```html
<todo>
  <div each={ item in items }>
    <h3>{ item.title }</h3>
  </div>
  <script>
    // a tag file can contain any JavaScript, even require()
    const resources = require('../resources.json')

    export default {
      items: [ { title: resources.en.first }, { title: resources.en.second } ]
    }
  </script>
</todo>
```

Note that your tag files actually need to have the extension ".riot".

### Compile Options

This plugin can give riot's compile options.

```bash
$ browserify -t [ riotify --ext html ] app.js
```

You can also configure it in package.json

```json
{
    "name": "my-package",
    "browserify": {
        "transform": [
            ["riotify", { "ext": ".html" }],
        ]
    }
}
```

#### Available option

- ext: `String`
  - custom extension, you’re free to use any file extension for your tags (instead of default .riot):

See more: https://github.com/riot/compiler

### With gulp.js

```javascript
const gulp       = require('gulp')
const browserify = require('browserify')
const riotify    = require('riotify')
const source     = require('vinyl-source-stream')

gulp.task('browserify', function(){
  browserify({ entries: ['src/app.js'] })
    .transform(riotify) // pass options if you need
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/'))
})
```

These are the simplest cases. `uglify` and `sourcemaps` would be needed.

## Tests

```bash
$ npm test
```

## Author

Originally written by Jan Henning Thorsen - jhthorsen@cpan.org<br/>
Maintained by Gianluca Guarini - gianluca.guarini@gmail.com

[ci-image]:https://img.shields.io/github/workflow/status/riot/riotify/test?style=flat-square
[ci-url]:https://github.com/riot/riotify/actions

[license-image]:https://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE

[npm-version-image]:https://img.shields.io/npm/v/riotify.svg?style=flat-square
[npm-downloads-image]:https://img.shields.io/npm/dm/riotify.svg?style=flat-square
[npm-url]:https://npmjs.org/package/riotify
