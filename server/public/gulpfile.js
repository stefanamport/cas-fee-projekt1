// Require gulp and plugins
var gulp = require('gulp'),
    gutil = require('gulp-util');
    clean = require('gulp-clean');
    sass = require('gulp-sass');
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant
    uglify = require('gulp-uglify');
    autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();

gulp.task('clean', function () {
	return gulp.src('dist/**/*', {read: false, force: true})
		.pipe(clean());
});

gulp.task('styles', function () {
  return gulp.src('./styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('images', function () {
    return gulp.src('./images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function() {
  return gulp.src('scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'));
});

// Task to watch for changes in our file sources
gulp.task('watch', function() {  
    
    gulp.watch('./styles/**/*.scss', ['styles']).on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

});

gulp.task('default', ['styles', 'scripts','images']);