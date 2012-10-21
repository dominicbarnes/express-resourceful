var glob    = require("glob"),
    _       = require("lodash"),
    methods = require("methods"),
    util    = require("./lib/util");

module.exports = function (app, base, opts) {
    opts = opts || Object.create(null);

    glob("**/*.js", { cwd: base }, function (err, resources) {
        if (err) throw new Error(err);

        _.each(resources, function (mod) {
            var resource = require(base + "/" + mod),
                url = resource.url || util.path2url(mod);

            if (opts.debug) console.log("\nLoading resource file: %s", mod);

            _.each(_.intersection(methods, _.keys(resource)), function (method) {
                if (opts.debug) console.log(" * %s %s", method.toUpperCase(), url);

                app[method](url, resource[method]);
            });
        });

        if (opts.callback) opts.callback();
    });
};
