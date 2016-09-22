var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var assets      = require('metalsmith-assets');
var changed     = require('metalsmith-changed');
var watch       = require('metalsmith-watch');
var nodeStatic  = require('node-static');
var open        = require('open');

var dir = {
    base:   __dirname + '/',
    lib:    __dirname + '/lib/',
    assets: __dirname + '/assets/',
    source: __dirname + '/src/',
    dest:   './build/'
};

Metalsmith(__dirname)
    //.use(changed())
    .use(
        watch({
            paths: {
                "./assets/**/*": true,
                "./layouts/**/*": "**/*"
            },
            livereload: true
        })
    )
    .use(markdown())
    .metadata({
        title: "My Static Site & Blog",
        description: "It's about saying »Hello« to the World.",
        generator: "Metalsmith",
        url: "http://www.metalsmith.io/"
    })
    .source(dir.source)
    .destination(dir.dest)
    .clean(false)
    .use(markdown())
    .use(permalinks())
    .use(assets({
        source: dir.assets,
        destination: 'assets'
    }))
    .use(layouts({
        engine: 'handlebars'
    }))
    .build(function(err, files) {
        if (err) { throw err; }
    });

/**
 * Serve files.
 */
/*var serve = new nodeStatic.Server(dir.dest);
require('http').createServer( function(req, res) {
    req.addListener('end', function() {
        serve.serve(req, res)
    });
    req.resume();
}).listen(8080);

open('http://localhost:8080');*/