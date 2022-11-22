import browsersync from 'browser-sync'
import child from 'child_process'
import gulp from 'gulp'
import gutil from 'gulp-util'
import concat from 'gulp-concat'
import minify from 'gulp-babel-minify'
import cleanCSS from 'gulp-clean-css'
import imagemin from 'gulp-imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminOptipng from 'imagemin-optipng'
import imageminSvgo from 'imagemin-svgo'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)
const browserSync = browsersync.create();
const siteRoot = "_site";

const cssDevFiles = "css/*.?(s)css";
const jsDevFiles = ["js/jquery.min.js", "js/bootstrap.min.js"];

gulp.task("compressImages", () =>
  gulp
    .src("images/**/*")
    .pipe(
      imagemin([
        imageminGifsicle({
          interlaced: true,
        }),
        imageminMozjpeg({
          progressive: true,
        }),
        imageminOptipng({
          optimizationLevel: 5,
        }),
        imageminSvgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      ]),
      {
        verbose: true,
      }
    )
    .pipe(gulp.dest("assets/images"))
);

gulp.task("concatJS", () => {
  return gulp
    .src(jsDevFiles)
    .pipe(concat("site.js"))
    .pipe(gulp.dest("assets/js"));
});

gulp.task("concatCSS", () => {
  return gulp
    .src([cssDevFiles])
    .pipe(sass())
    .pipe(concat("site.css"))
    .pipe(gulp.dest("assets/css"));
});

gulp.task(
  "minifyJS",
  gulp.series("concatJS", () => {
    return gulp
      .src("assets/js/site.js")
      .pipe(minify())
      .on("error", (err) => {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(gulp.dest("assets/js"));
  })
);

gulp.task(
  "minifyCSS",
  gulp.series("concatCSS", () => {
    return gulp
      .src("assets/css/site.css")
      .pipe(
        cleanCSS({
          compatibility: "ie8",
        })
      )
      .pipe(gulp.dest("assets/css"));
  })
);

gulp.task("clean", function (done) {
  const jekyll = child.spawn("jekyll", ["clean"]);
  const jekyllLogger = (buffer) => {
    buffer
      .toString()
      .split(/\n/)
      .forEach((message) => gutil.log("Jekyll: " + message));
  };
  jekyll.stdout.on("data", jekyllLogger);
  jekyll.stderr.on("data", jekyllLogger);
  done();
});

gulp.task(
  "build-watch",
  gulp.series(["compressImages", "clean"], function (done) {
    const jekyll = child.spawn("jekyll", [
      "build",
      "--watch",
      "--incremental",
      "--drafts",
    ]);
    const jekyllLogger = (buffer) => {
      buffer
        .toString()
        .split(/\n/)
        .forEach((message) => gutil.log("Jekyll: " + message));
    };
    jekyll.stdout.on("data", jekyllLogger);
    jekyll.stderr.on("data", jekyllLogger);
    done();
  })
);

gulp.task(
  "build",
  gulp.series(["compressImages", "clean"], function (done) {
    const jekyll = child.spawn("jekyll", ["build", "-d", "public"]);
    const jekyllLogger = (buffer) => {
      buffer
        .toString()
        .split(/\n/)
        .forEach((message) => gutil.log("Jekyll: " + message));
    };
    jekyll.stdout.on("data", jekyllLogger);
    jekyll.stderr.on("data", jekyllLogger);
    done();
  })
);

gulp.task("serve", function (done) {
  browserSync.init({
    files: [siteRoot + "/**"],
    port: 4000,
    server: {
      baseDir: siteRoot,
    }
  });
  done();
});

gulp.task("release", gulp.series(["minifyCSS", "minifyJS", "build"]));
gulp.task(
  "default",
  gulp.series(["minifyCSS", "minifyJS", "build-watch", "serve"])
);
