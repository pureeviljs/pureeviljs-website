
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');

var paginate    = require('metalsmith-pager');
var collections = require('metalsmith-collections');

function skip(options){
    return function(files, metalsmith, done){
        for (var k in files){
            if (files.hasOwnProperty(k) && options.pattern.test(k)){
                delete files[k];
            }
        }
        done();
    };
};

Metalsmith(__dirname)
    .metadata({
        title: "My Static Site & Blog",
        description: "It's about saying »Hello« to the World.",
        generator: "Metalsmith",
        url: "http://www.metalsmith.io/"
    })
    .use(skip({ pattern: /^__/ }))
    .source('./src')
    .destination('./build')
    .clean(false)
    .use(collections({
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(paginate({
        // name of the collection the files belong
        collection: 'posts',

        // maximum number of element that could be displayed
        // in the same page.
        elementsPerPage: 5,

        // pattern for the path at which the page trunk should
        // be available
        pagePattern: 'page/:PAGE/index.html',

        // format in which the page number should be displayed
        // in the page navigation bar
        pageLabel: '[ :PAGE ]',

        // name of the file that will be the homepage.
        // this file will have the same info of the page "page/1/index.html".
        index: 'pagerx.html',

        // path where the pagination template is located.
        // it should be relative to the path configured as "source" for metalsmith.
        paginationTemplatePath: '__partials/pagination.html',

        // name of the layout that should be used to create the page.
        layoutName: 'archive.html'
    }))
    .use(markdown())
    .use(permalinks())
    .use(layouts({
        engine: 'handlebars'
    }))
    .build(function(err, files) {
        if (err) { throw err; }
        console.log('DONE!');
    });