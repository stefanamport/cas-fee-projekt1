var gulp = require('gulp'),
    gutil = require('gulp-util');
    clean = require('gulp-clean');
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');

var server = require('gulp-express');
 
gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
 
    // Restart the server when file changes 
    gulp.watch(['public/**/*.html'], server.notify);
    gulp.watch(['public/styles/**/*.scss'], ['styles:scss']);

    gulp.watch(['{.tmp,public}/styles/**/*.css'], function(event){
        gulp.run('styles:css');
        server.notify(event);
        //pipe support is added for server.notify since v0.1.5, 
        //see https://github.com/gimm/gulp-express#servernotifyevent 
    });
 
    gulp.watch(['public/js/**/*.js'], ['jshint']);
    gulp.watch(['public/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

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

gulp.task('default', ['styles']);