[![Build
Status](https://travis-ci.org/jhthorsen/riotify.svg)](https://travis-ci.org/jhthorsen/riotify)

# riotify

"riotify" is a browserify transformer for [riot](https://muut.com/riotjs) ".tag" files.

## Installation

    npm install riotify

## Usage

This module is meant to be used together with
[browserify](http://browserify.org) or
[module-deps](https://github.com/substack/module-deps):

Either of the two commands below result creates the same result:

    browserify -t riotify app.js
    module-deps -t riotify app.js | browser-pack

Example `app.js`:

    var riot = require('riot')
    var todo = require('./todo.tag')
    riot.mount(todo)

Example `todo.tag`:

    <todo>
      <div each={ items }>
        <h3>{ title }</h3>
      </div>
      
      // a tag file can contain any JavaScript, even require()
      var resources = require('../resources.json')    
      this.items = [ { title: resources.en.first }, { title: resources.en.second } ]
    </todo>

Note that your tag files actually need to have the extension ".tag".

### Compile Options

This plugin can give riot's compile options.

    % browserify -t [ riotify --type coffeescript --template jade ] app.js

You can also configure it in package.json

```json
{
    "name": "my-package",
    "browserify": {
        "transform": [
            [ "riotify", {"type": "coffeescript", "template": "jade" } ],
        ]
    }
}
```

#### Available option

* compact: `Boolean`
  * Minify `</p> <p>` to `</p><p>`
* expr: `Boolean`
  * Run expressions trough parser defined with `--type`
* type: `String, coffeescript | cs | es6 | none`
  * JavaScript pre-processor
* template: `String, jade`
  * HTML pre-processor
* ext: `String`
  * custom extension, you’re free to use any file extension for your tags (instead of default .tag):

See more: https://muut.com/riotjs/compiler.html

### With gulp.js

```javascript
var gulp       = require('gulp');
var browserify = require('browserify');
var riotify    = require('riotify');
var source     = require('vinyl-source-stream');

gulp.task('browserify', function(){
  browserify({ entries: ['src/app.js'] })
  .transform(riotify, { template: 'jade' }) // pass options if you need
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('dist/'))
});
```

These are the simplest cases. `uglify` and `sourcemaps` would be needed.

## Tests

    npm test

## Author

Jan Henning Thorsen - jhthorsen@cpan.org
