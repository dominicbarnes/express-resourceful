var assert = require('assert');
var express = require('express');
var path = require('path');
var resources = require('..');

var fixture = path.resolve.bind(path, __dirname, 'fixtures');

describe('express-resourceful', function () {
  it('should be a function', function () {
    assert.equal(typeof resources, 'function');
  });

  it('should automatically add to the express router', function () {
    var app = express.Router();

    resources(app, fixture('simple'));

    assert.deepEqual(routes(app), {
      '/': [ 'get' ]
    });
  });

  it('should incorporate nested directories into the path', function () {
    var app = express.Router();

    resources(app, fixture('nested'));

    assert.deepEqual(routes(app), {
      '/': [ 'get' ],
      '/a/b/c': [ 'get' ]
    });
  });

  it('should allow overriding the url internally', function () {
    var app = express.Router();

    resources(app, fixture('custom-url'));

    assert.deepEqual(routes(app), {
      '/custom': [ 'get' ]
    });
  });

  it('should handle route params correctly', function () {
    var app = express.Router();

    resources(app, fixture('url-params'));

    assert.deepEqual(routes(app), {
      '/:a': [ 'get' ],
      '/a/:b': [ 'get' ]
    });
  });

  it('should attach multiple methods if exported', function () {
    var app = express.Router();

    resources(app, fixture('methods'));

    assert.deepEqual(routes(app), {
      '/': [ 'delete', 'get', 'post', 'put' ]
    });
  });

  it('should use the _params directory for params instead of routes', function () {
    var app = express.Router();

    resources(app, fixture('params'));

    assert.deepEqual(routes(app), {
      '/': [ 'get' ]
    });

    assert.deepEqual(params(app), [ 'user' ]);
  });

  it('should sort routes in a reasonable way', function () {
    var app = express.Router();

    resources(app, fixture('sort-order'));

    var routes = app.stack.map(function (fn) {
      return fn.route.path;
    });

    assert.deepEqual(routes, [ '/', '/page', '/:page' ]);
  });

  it('should add prefixes to the paths', function () {
    var app = express.Router();

    resources(app, fixture('simple'), '/api');

    assert.deepEqual(routes(app), {
      '/api/': [ 'get' ]
    });
  });
});

function routes(router) {
  var ret = {};

  router.stack.forEach(function (fn) {
    var route = fn.route;
    if (!(route.path in ret)) ret[route.path] = [];
    var methods = ret[route.path];
    route.stack.forEach(function (fn) {
      methods.push(fn.method);
    });
    methods.sort();
  });

  return ret;
}

function params(router) {
  return Object.keys(router.params).sort();
}
