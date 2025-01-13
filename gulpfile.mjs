import { create } from 'browser-sync';
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
const browserSync = create();
const siteRoot = "public";

const cssDevFiles = "css/*.?(s)css";

export const compressImages = () =>
  gulp
    .src("images/**/*", { encoding: false })
    .pipe(
      imagemin(
        [
          imageminGifsicle({ interlaced: true }),
          imageminMozjpeg({ progressive: true }),
          imageminOptipng({ optimizationLevel: 5 }),
          imageminSvgo({
            plugins: [
              { removeViewBox: true },
              { cleanupIDs: false },
            ],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(gulp.dest("assets/images"));

export const concatCSS = () =>
  gulp
    .src([cssDevFiles])
    .pipe(sass())
    .pipe(concat("site.css"))
    .pipe(gulp.dest("assets/css"));

export const minifyCSS = gulp.series(concatCSS, () =>
  gulp
    .src("assets/css/site.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("assets/css"))
);

export const clean = () => {
  return new Promise((resolve, reject) => {
    const jekyll = spawn("jekyll", ["clean"], { stdio: "inherit" });
    jekyll.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Jekyll clean failed with exit code ${code}`));
    });
  });
};

export const buildWatch = gulp.series(compressImages, clean, () => {
  return new Promise((resolve, reject) => {
    const jekyll = spawn(
      "jekyll",
      ["build", "--watch", "--incremental", "--drafts", "-d", `${siteRoot}`],
      { stdio: "inherit" }
    );
    jekyll.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Jekyll build failed with exit code ${code}`));
    });
  });
});

export const build = gulp.series(compressImages, clean, () => {
  return new Promise((resolve, reject) => {
    const jekyll = spawn("jekyll", ["build", "-d", `${siteRoot}`], { stdio: "inherit" });
    jekyll.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Jekyll build failed with exit code ${code}`));
    });
  });
});

export const serve = (done) => {
  browserSync.init({
    files: [`${siteRoot}/**`],
    port: 4000,
    server: {
      baseDir: siteRoot,
    },
  });
  done();
};

export const release = gulp.series(minifyCSS, build);
export default gulp.series(minifyCSS, gulp.parallel(buildWatch, serve));
