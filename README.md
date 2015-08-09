# express-resourceful

> Load express routes (and params) automatically from a directory, where
> the path to each file corresponds to it's URL.

## Installation

```sh
npm install express-resourceful
```

## Usage

### app script

```js
var express = require('express');
var resourceful = require('express-resourceful');

var app = require('express');

resourceful(app, 'resources'); // runs synchronously
```

### resources dir

| path to resource  | url            |
| ----------------- | -------------- |
| `index.js`        | `/`            |
| `users/index.js`  | `/users`       |
| `users/:user.js`  | `/users/:user` |
| `_params/user.js` | *(param)*      |

### resource script

Each exported method that corresponds to an HTTP method will be added to
the router/app.

```js
exports.url = '/foo'; // *OPTIONAL* can be used to override the default url

exports.get = function (req, res) {
  // GET handler...
};

exports.post = function (req, res) {
  // POST handler...
};
```

### param script

A single exported function can be used as a param handler. (where the param
name is determined by the filename)

```js
module.exports = function (req, res, next, id) {
  // param handler
};
```

## API

### `resourceful(app, dir, [prefix])`

Will scan the given `dir` (sychronously) for resource files and mount them to
`app`. (which can either be a plain express app or an `express.Router` instance)

The optional `prefix` will be prepended onto the generated paths.

Any files found in the `_params` directory will be treated as param handlers.

**NOTE**: Resource files beginning with a `:` (ie: route params) will be mounted
**after** static routes, to prevent a route like `/users/new` from being preempted
by `users/:user`.
