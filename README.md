[![Build
Status](https://travis-ci.org/riot/riotify.svg)](https://travis-ci.org/riot/riotify)

# riotify

"riotify" is a browserify transformer for [riot](https://github.com/riot/riot) ".tag" files.

## Installation

```bash
$ npm install riotify @riotjs/compiler
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
import Todo from './todo.tag'
import {component} from 'riot'

component(Todo)(document.getElementById('todo'))
```

Example `todo.tag`:

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

Note that your tag files actually need to have the extension ".tag".

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
  - custom extension, you’re free to use any file extension for your tags (instead of default .tag):

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
