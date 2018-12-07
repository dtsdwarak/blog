const browserSync = require('browser-sync').create();
const siteRoot = '_site';
const child = require('child_process');
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const minify = require('gulp-babel-minify');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

const cssDevFiles = 'css/*.?(s)css';
const jsDevFiles = 'js/*.js';

gulp.task('compressImages', () =>
  gulp.src('images/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({
      interlaced: true
    }),
    imagemin.jpegtran({
      progressive: true
    }),
    imagemin.optipng({
      optimizationLevel: 5
    }),
    imagemin.svgo({
      plugins: [{
          removeViewBox: true
        },
        {
          cleanupIDs: false
        }
      ]
    })
  ]), {
    verbose: true
  })
  .pipe(gulp.dest('assets/images'))
);

gulp.task('concatJS', () => {
  return gulp.src([
      jsDevFiles
    ])
    .pipe(concat('site.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('concatCSS', () => {
  return gulp.src([
      cssDevFiles
    ])
    .pipe(sass())
    .pipe(concat('site.css'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('minifyJS', ['concatJS'], () => {
  return gulp.src('assets/js/site.js')
    .pipe(minify())
    .on('error', (err) => {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('assets/js'));
});

gulp.task('minifyCSS', ['concatCSS'], () => {
  return gulp.src('assets/css/site.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('clean', () => {
  const jekyll = child.spawn('jekyll', [
    'clean'
  ]);
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('build-watch', ['compressImages', 'clean'], () => {
  const jekyll = child.spawn('jekyll', [
    'build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('build', ['compressImages', 'clean'], () => {
  const jekyll = child.spawn('jekyll', [
    'build',
    '-d', 'public'
  ]);
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('release', ['minifyCSS', 'minifyJS', 'build']);
gulp.task('default', ['minifyCSS', 'minifyJS', 'build-watch', 'serve']);
