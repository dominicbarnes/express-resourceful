var path = require("path");

exports.path2url = function (file) {
    var base = path.basename(file, ".js"),
        dir  = path.dirname(file);

    if (dir === ".") dir = "";

    return "/" + (base === "index" ? dir : path.join(dir, base));
};
