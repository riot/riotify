# riotify

"riotify" is a browserify processor for [riot](https://muut.com/riotjs) tag files.

## DISCLAIMER

It is currently not possible to use "riot" with browserify. Loading ".tag"
files using `require()` will not return the tag, but simple register them
in the global `riot` object.

See [issue#139](https://github.com/muut/riotjs/issues/139) for more details.

## Installation

    npm install riotify

## Usage

This module is meant to be used together with
[browserify](http://browserify.org) or
[module-deps](https://github.com/substack/module-deps):

    browserify -t riotify app.js
    module-deps -t riotify test/todo.tag | browser-pack

Example `app.js`:

    require('./todo.tag')
    riot.mount('todo')

Example `todo.tag`:

    <todo>
      <div each={ items }>
        <h3>{ title }</h3>
      </div>

      this.items = [ { title: 'First' }, { title: 'Second' } ]
    </todo>

## Tests

    npm test

## Author

Jan Henning Thorsen - jhthorsen@cpan.org
