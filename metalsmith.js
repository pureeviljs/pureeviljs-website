var Metalsmith   = require('metalsmith');
var collections  = require('metalsmith-collections');
var markdown     = require('metalsmith-markdown');
var templates    = require('metalsmith-templates');
var permalinks   = require('metalsmith-permalinks');
var tags         = require('metalsmith-tags');
var gist         = require('metalsmith-gist');
var drafts       = require('metalsmith-drafts');
var pagination   = require('metalsmith-pagination'); // <-- nova dependência
var assets       = require('metalsmith-assets');

var fs           = require('fs');
var Handlebars   = require('handlebars');
var moment       = require('moment');
var baseUrl      = 'http://localhost:8080/pureeviljs.github.com/build';

Handlebars.registerPartial({
    'header':       fs.readFileSync('./templates/partials/header.hbt').toString(),
    'footer':       fs.readFileSync('./templates/partials/footer.hbt').toString(),
    'banner':       fs.readFileSync('./templates/partials/banner.hbt').toString(),
    'postbanner':   fs.readFileSync('./templates/partials/postbanner.hbt').toString()
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
// helpers para marcar a página corrente
Handlebars.registerHelper('currentPage', function( current, page ) {
    return current === page ? 'current' : '';
});

module.exports = function () {
    Metalsmith(__dirname)
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
        .use(markdown())
        .use(permalinks({
            pattern: ':title',
            relative: false
        }))
        .use(pagination({
            'collections.posts': {
                perPage: 2,
                template: 'index.hbt',
                first: 'index.html',
                path: 'pages/:num/index.html'
            }
        }))
        .use(gist())
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
