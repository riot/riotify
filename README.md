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
    require('./todo.tag')
    riot.mount('todo')

Example `todo.tag`:

    <todo>
      <div each={ items }>
        <h3>{ title }</h3>
      </div>

      this.items = [ { title: 'First' }, { title: 'Second' } ]
    </todo>

Note that your tag files actually need to have the extension ".tag".

## Tests

    npm test

## Author

Jan Henning Thorsen - jhthorsen@cpan.org
