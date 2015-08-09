var debug = require('debug')('express-resourceful');
var glob = require('glob').sync;
var methods = require('methods');
var path = require('path');

module.exports = function (app, base, prefix) {
  var options = {
    cwd: path.resolve(base),
    matchBase: true
  };

  var files = glob('*.js', options);
  debug('found %d resources', files.length);

  files.sort(sorter);

  files.forEach(function (file) {
    var resource = require(path.resolve(base, file));
    var url = resource.url || path2url(file);
    if (prefix) url = prefix += url;

    if (isParam(file)) {
      var name = path.basename(file, '.js');
      debug('processing param %s', name);
      app.param(name, resource);
    } else {
      debug('processing resource %s', file, url);
      methods.forEach(function (method) {
        if (method in resource) {
          debug('adding %s %s handler', method, url);
          app[method](url, resource[method]);
        }
      });
    }
  });
};

function path2url(file) {
  var base = path.basename(file, '.js');
  var dir = path.dirname(file);

  if (dir === '.') dir = '';

  return '/' + (base === 'index' ? dir : path.join(dir, base));
}

function isParam(file) {
  return file.slice(0, 7) === '_params';
}

function sorter(a, b) {
  var a1 = a.split('/');
  var b1 = b.split('/');

  var len = Math.max(a1.length, b1.length);

  for (var x = 0; x < len; x += 1) {
    if (a1[x] === b1[x]) continue;       // same path, try next one
    if (a1[x] === 'index.js') return -1; // index always pushed forward
    if (a1[x][0] === ':') return 1;      // url params always pushed back
    return a1[x] < b1[x] ? -1 : 1;       // normal comparison
  }
}
