var Metalsmith   = require('metalsmith');
var collections  = require('metalsmith-collections');
var markdown     = require('metalsmith-markdown');
var templates    = require('metalsmith-templates');
var permalinks   = require('metalsmith-permalinks');
var tags         = require('metalsmith-tags');
var gist         = require('metalsmith-gist');
var drafts       = require('metalsmith-drafts');
var pagination   = require('metalsmith-pagination');
var assets       = require('metalsmith-assets');
var metallic     = require('metalsmith-metallic');
var precompiler  = require('./metalsmith-helpers/markdown-precompiler');

var fs           = require('fs');
var Handlebars   = require('handlebars');
var moment       = require('moment');
var baseUrl      = 'http://localhost:8080/pureeviljs.github.com/build';

Handlebars.registerPartial({
    'header':       fs.readFileSync('./templates/partials/header.hbt').toString(),
    'footer':       fs.readFileSync('./templates/partials/footer.hbt').toString(),
    'banner':       fs.readFileSync('./templates/partials/banner.hbt').toString(),
    'postbanner':   fs.readFileSync('./templates/partials/postbanner.hbt').toString(),
});

Handlebars.registerHelper('baseUrl', function() {
    return baseUrl;
});
Handlebars.registerHelper('dateFormat', function( context ) {
    return moment(context).format("LL");
});
Handlebars.registerHelper('dateGMT', function( context ) {
    context = context === 'new' ? new Date() : context;
    return context.toGMTString();
});

Handlebars.registerHelper('currentPage', function( current, page ) {
    return current === page ? 'current' : '';
});

Handlebars.registerHelper('if_noteq', function(a, b, opts) {
    if (a != b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

module.exports = function () {
    Metalsmith(__dirname)
        /*.use(partials({
            directory: 'src/examples'
        }))*/
        .use(drafts())
        .use(assets({
            source: __dirname + '/assets',
            destination: 'assets'
        }))
        .use(collections({
            posts: {
                pattern: 'posts/*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(precompiler({
            directories: ['examples'],
            root: 'src'
        }))
        .use(metallic())
        .use(markdown())
        .use(permalinks({
            pattern: ':title',
            relative: false
        }))
        .use(pagination({
            'collections.posts': {
                perPage: 5,
                template: 'index.hbt',
                first: 'index.html',
                path: 'pages/:num/index.html'
            }
        }))
        .use(tags({
            handle: 'tags',
            template:'tags.hbt',
            path:'tags',
            sortBy: 'title',
            reverse: true
        }))
        .use(templates('handlebars'))
        .destination('./build')
        .build(function(err, files) {
            if (err) { throw err; }
        });
};
