// Require gulp and plugins
var gulp = require('gulp'),
    gutil = require('gulp-util');
    clean = require('gulp-clean');
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', function () {
	return gulp.src('public/dist/**/*', {read: false, force: true})
		.pipe(clean());
});

gulp.task('styles', function () {
  return gulp.src('./public/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('./public/styles/'));
});

// Task to watch for changes in our file sources
gulp.task('watch', function() {  
    
    gulp.watch('./public/styles/**/*.scss', ['styles']).on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

});

gulp.task('default', ['styles']);