var gulp = require('gulp');
var babel = require('gulp-babel');
var inject = require('gulp-inject');
var log = require('fancy-log');
var del = require('del');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

//global tasks

//dev tasks
gulp.task('clean', function(done) {
    return del(paths.tmp + '/**/*');
});

gulp.task('vendor', function() {
    return gulp.src("./node_modules/jquery/dist/jquery.js")
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('html', function() {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function() {
    return gulp.src(paths.srcCSS)
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function() {
    return gulp.src(paths.srcJS)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', gulp.series(['clean', 'vendor', 'html', 'css', 'js']));

gulp.task('inject', gulp.series(['copy'], function() {
    var css = gulp.src(paths.tmpCSS, { read: false });
    var js = gulp.src(paths.tmpJS, { read: false });
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.tmp));
}));

gulp.task('serve', gulp.series(['inject'], function() {
    return gulp.src(paths.tmp)
        .pipe(webserver({
            port: 3002,
            livereload: true
        }));
}));

gulp.task('watch', gulp.series(['serve'], function(done) {
    gulp.watch(paths.src, gulp.series(['inject']));
    done();
}));

gulp.task('default', gulp.series(['watch']));


//dist tasks
gulp.task('clean:dist', function(done) {
    return del(paths.dist + '/**/*');
});

gulp.task('vendor:dist', function() {
    return gulp.src("./node_modules/jquery/dist/jquery.min.js")
        .pipe(gulp.dest(paths.dist));
});

gulp.task('html:dist', function() {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function() {
    return gulp.src(paths.srcCSS)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function() {
    return gulp.src(paths.srcJS)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', gulp.series(['clean:dist', 'vendor:dist', 'html:dist', 'css:dist', 'js:dist']));

gulp.task('inject:dist', gulp.series(['copy:dist'], function() {
    var css = gulp.src(paths.distCSS, { read: false });
    var js = gulp.src(paths.distJS, { read: false });
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
}));

gulp.task('build', gulp.series(['inject:dist']));