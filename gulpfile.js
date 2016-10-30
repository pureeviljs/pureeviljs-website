// Assigning modules to local variables
var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var pkg = require('./package.json');
var msmith = require('./metalsmith.js');


// Default task
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy', 'metalsmith']);

gulp.task('clean', function () {
    return gulp.src(dir.dest).pipe(clean());
});

gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome', 'highlightjs']);

gulp.task('metalsmith', function() {
    return msmith();
});

// Less task to compile the less files and add the banner
gulp.task('less', function() {
    return gulp.src('less/clean-blog.less')
        .pipe(less())
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
    return gulp.src('js/clean-blog.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('highlightjs', function() {
    return gulp.src(['node_modules/highlight.js/styles/atelier-cave.dark.css'])
        .pipe(gulp.dest('assets/vendor/highlightjs'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('assets/vendor/bootstrap'))
});

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
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
