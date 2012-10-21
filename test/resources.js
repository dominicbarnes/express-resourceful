var _ = require("lodash"),
    resources = require(".."),
    util = require("../lib/util"),
    express = require("express"),
    app = express();

app.configure(function () {
    app.use(app.router);
});

describe("express-resourceful", function () {
    before(function (done) {
        resources(app, __dirname + "/../example/resources", { callback: done });
    });

    function checkRoute(verb, url) {
        _.any(app.routes[verb], function (route) {
            return route.path === url;
        }).should.be.true;
    }

    it("should be a function", function () {
        resources.should.be.a("function");
    });

    it("should add the following routes to express' router", function () {
        checkRoute("get",    "/");

        checkRoute("get",    "/users");
        checkRoute("post",   "/users");

        checkRoute("get",    "/users/:user");
        checkRoute("post",   "/users/:user");
        checkRoute("delete", "/users/:user");
    });

    describe("util", function () {
        describe(".path2url()", function () {
            it("should return a URI based on the full path", function () {
                util.path2url("users.js").should.equal("/users");
                util.path2url("users/:user.js").should.equal("/users/:user");
                util.path2url("users/:user/edit.js").should.equal("/users/:user/edit");
            });

            it("should convert index into dirname", function () {
                util.path2url("index.js").should.equal("/");
                util.path2url("users/index.js").should.equal("/users");
                util.path2url("users/:user/index.js").should.equal("/users/:user");
            });
        });
    });
});
