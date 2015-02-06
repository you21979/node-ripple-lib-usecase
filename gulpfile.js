var gulp = require('gulp');
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')

gulp.task('build', function() {
    browserify({
          entries: ['./entry.js'],
          extensions: ['.js']
        })
        .bundle()
        .pipe(source('ripple_usecase.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});
