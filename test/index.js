var assert = require('assert');
var express = require('express');
var path = require('path');
var resources = require('..');

var fixture = path.resolve.bind(path, __dirname, 'fixtures');

describe('express-resourceful', function () {
  it('should be a function', function () {
    assert.equal(typeof resources, 'function');
  });

  it('should automatically add to the express router', function (done) {
    var app = express.Router();

    resources(app, fixture('simple'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/': [ 'get' ]
      });

      done();
    });
  });

  it('should incorporate nested directories into the path', function (done) {
    var app = express.Router();

    resources(app, fixture('nested'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/': [ 'get' ],
        '/a/b/c': [ 'get' ]
      });

      done();
    });
  });

  it('should allow overriding the url internally', function (done) {
    var app = express.Router();

    resources(app, fixture('custom-url'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/custom': [ 'get' ]
      });

      done();
    });
  });

  it('should handle route params correctly', function (done) {
    var app = express.Router();

    resources(app, fixture('url-params'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/:a': [ 'get' ],
        '/a/:b': [ 'get' ]
      });

      done();
    });
  });

  it('should attach multiple methods if exported', function (done) {
    var app = express.Router();

    resources(app, fixture('methods'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/': [ 'delete', 'get', 'post', 'put' ]
      });

      done();
    });
  });

  it('should use the _params directory for params instead of routes', function (done) {
    var app = express.Router();

    resources(app, fixture('params'), function (err) {
      if (err) return done(err);

      assert.deepEqual(routes(app), {
        '/': [ 'get' ]
      });

      assert.deepEqual(Object.keys(app.params), [ 'user' ]);

      done();
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
