// Assigning modules to local variables
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var metalsmith = require('gulp-metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var assets      = require('metalsmith-assets');

var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Metalsmith
var dir = {
    base:   __dirname + '/',
    lib:    __dirname + '/lib/',
    assets: __dirname + '/assets/',
    source: __dirname + '/src/',
    dest:   './build/'
};

// Default task
// Default task
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);

// Less task to compile the less files and add the banner
gulp.task('less', function() {
    return gulp.src('less/clean-blog.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('assets/css'))
});

// Minify CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('assets/css/clean-blog.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('assets/js/clean-blog.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('assets/vendor/bootstrap'))
});

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('assets/vendor/jquery'))
});

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('assets/vendor/font-awesome'))
});

gulp.task('metalsmith', function() {
    return gulp.src('src/**')
        .pipe(metalsmith({
            root: __dirname,
            metadata: {
                title: "My Static Site & Blog",
                description: "It's about saying »Hello« to the World.",
                generator: "Metalsmith",
                url: "http://www.metalsmith.io/"
            },
            use: [
                //clean(false),
                //source(dir.source),
                //destination(dir.dest),
                markdown(),
                permalinks(),
                assets({
                    source: dir.assets,
                    destination: 'assets'
                }),
                layouts({
                    engine: 'handlebars'
                })
            ]
        })).pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return gulp.src(dir.dest).pipe(clean());
});

// Copy all third party dependencies from node_modules to vendor directory
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);


// Watch Task that compiles LESS and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', ['less', 'minify-css', 'minify-js'], function() {
    /** watch */
});

// build all
gulp.task('build-all', ['clean', 'less', 'minify-css', 'minify-js', 'metalsmith']);