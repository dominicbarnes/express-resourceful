## express-resourceful

This express extension allows for you to separate your resources into individual
files, and to organize them in a filesystem hierarchy matching the URI.

An individual resource file can export any number of HTTP methods supported by
Node.js and Express.js. Examples include the usual get/put/post/delete,
but can include others. (see [methods NPM module](https://npmjs.org/package/methods)
for a complete list)

To add a resource to your application/routes, just add a new file under a dedicated
resources directory. It's name and directory structure should match the URI, with
the exception being `index.js` which will simply be mapped to the directory name.

### Installation

    npm install express-resourceful

### Quick Sample

** Filesystem **

```
+-my-application-dir/
  +-resources/
  | +-index.js        -> /
  | +-users/
  |   +-index.js      -> /users
  |   +-:user.js      -> /users/:user
  +-app.js
```

** Resource File **

```javascript
exports.get = function (req, res) {
    // Route Handler for a GET request on this URI
};

exports.post = function (req, res) {
    // Route Handler for a POST request on this URI
};
```

### Change Log

** 0.0.1 **
 - Initial Release
