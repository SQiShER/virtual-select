const gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  del = require('del'),
  path = require('path'),
  jspm = require('gulp-jspm'),
  rename = require('gulp-rename'),
  KarmaServer = require('karma').Server;

const options = {
  buildDir: 'dist/',
};

gulp.task('css', () => {
  return gulp.src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.buildDir));
});

gulp.task('javascript', () => {
  return gulp.src('src/virtual-select-jquery.js')
    .pipe(sourcemaps.init())
    .pipe(jspm({
      selfExecutingBundle: true,
      minify: true,
    }))
    .pipe(rename('virtual-select-jquery.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.buildDir));
});

gulp.task('test', (done) => {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
  }, done).start();
});

gulp.task('clean', () => {
  return del([options.buildDir]);
});

gulp.task('build', ['css', 'javascript']);

gulp.task('develop', ['build'], () => {
  gulp.watch('src/**/*.css', ['css']);
  gulp.watch('src/**/*.js', ['javascript']);
});

gulp.task('release', ['build']);
gulp.task('default', ['develop']);
