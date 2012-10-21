var express = require("express"),
    resources = require("express-resourceful"),
    app = express();

// other app configuration (make sure router is added via app.use before loading resources)

resources(app, __dirname + "/resources", { debug: true });
