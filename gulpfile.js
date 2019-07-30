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
const jsDevFiles = ['js/jquery.min.js', 'js/bootstrap.min.js'];

gulp.task('compressImages', gulp.series(() =>
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
  .pipe(gulp.dest('assets/images')))
);

gulp.task('concatJS', gulp.series(() => {
  return gulp.src(jsDevFiles)
    .pipe(concat('site.js'))
    .pipe(gulp.dest('assets/js'));
}));

gulp.task('concatCSS', gulp.series(() => {
  return gulp.src([
      cssDevFiles
    ])
    .pipe(sass())
    .pipe(concat('site.css'))
    .pipe(gulp.dest('assets/css'));
}));

gulp.task('minifyJS', gulp.series(['concatJS'], () => {
  return gulp.src('assets/js/site.js')
    .pipe(minify())
    .on('error', (err) => {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('assets/js'));
}));

gulp.task('minifyCSS', gulp.series(['concatCSS'], () => {
  return gulp.src('assets/css/site.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('assets/css'));
}));

gulp.task('clean', gulp.series(done => {
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
  done();
}));

gulp.task('build-watch', gulp.series(['compressImages', 'clean'], done => {
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
  done();
}));

gulp.task('build', gulp.series(['compressImages', 'clean'], done => {
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
  done();
}));

gulp.task('serve', gulp.series(done => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
  done();
}));

gulp.task('release', gulp.series(['minifyCSS', 'minifyJS', 'build']));
gulp.task('default', gulp.series(['minifyCSS', 'minifyJS', 'build-watch', 'serve']));
