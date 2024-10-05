import browsersync from 'browser-sync';
import { spawn } from 'child_process';
import gulp from 'gulp';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import log from 'fancy-log';

const sass = gulpSass(dartSass);
const browserSync = browsersync.create();
const siteRoot = "public";

const cssDevFiles = "css/*.?(s)css";

gulp.task("compressImages", () =>
  gulp
    .src("images/**/*", {encoding: false})
    .pipe(
      imagemin([
        imageminGifsicle({ interlaced: true }),
        imageminMozjpeg({ progressive: true }),
        imageminOptipng({ optimizationLevel: 5 }),
        imageminSvgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false },
          ],
        }),
      ], {
        verbose: true,
      })
    )
    .pipe(gulp.dest("assets/images"))
);

gulp.task("concatCSS", () =>
  gulp
    .src([cssDevFiles])
    .pipe(sass())
    .pipe(concat("site.css"))
    .pipe(gulp.dest("assets/css"))
);

gulp.task("minifyCSS", gulp.series("concatCSS", () =>
  gulp
    .src("assets/css/site.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("assets/css"))
));

gulp.task("clean", (done) => {
  const jekyll = spawn("jekyll", ["clean"]);
  jekyll.stdout.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.stderr.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.on("close", done);
});

gulp.task("build-watch", gulp.series("compressImages", "clean", (done) => {
  const jekyll = spawn("jekyll", ["build", "--watch", "--incremental", "--drafts", "-d", `${siteRoot}`]);
  jekyll.stdout.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.stderr.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.on("close", done);
}));

gulp.task("build", gulp.series("compressImages", "clean", (done) => {
  const jekyll = spawn("jekyll", ["build", "-d", `${siteRoot}`]);
  jekyll.stdout.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.stderr.on("data", (data) => log("Jekyll:", data.toString()));
  jekyll.on("close", done);
}));

gulp.task("serve", (done) => {
  browserSync.init({
    files: [`${siteRoot}/**`],
    port: 4000,
    server: {
      baseDir: siteRoot,
    },
  });
  done();
});

gulp.task("release", gulp.series("minifyCSS", "build"));
gulp.task("default", gulp.series("minifyCSS", gulp.parallel("build-watch", "serve")));
