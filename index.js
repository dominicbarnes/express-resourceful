var debug = require('debug')('express-resourceful');
var glob = require('glob');
var methods = require('methods');
var path = require('path');

module.exports = function (app, base, callback) {
  var options = {
    cwd: path.resolve(base),
    matchBase: true
  };

  glob('*.js', options, function (err, files) {
    if (err) return callback(err);

    debug('found %d resources', files.length);

    files.forEach(function (file) {
      var resource = require(path.resolve(base, file));
      var url = resource.url || path2url(file);
      debug('processing resource %s', file, url);

      if (isParam(file)) {
        app.param(path.basename(file, '.js'), resource);
      } else {
        methods.forEach(function (method) {
          if (method in resource) {
            debug('adding %s %s handler', method, url);
            app[method](url, resource[method]);
          }
        });
      }
    });

    callback();
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
