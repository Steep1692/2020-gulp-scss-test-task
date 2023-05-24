"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build/"
    },
    port: 3000
  });
  done();
}

// Clean assets
function clean() {
  return del(["./build/css/"]);
}

// CSS task
function css() {
  return gulp
    .src("./scss/main.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./build/css/"))
    .pipe(browsersync.stream());
}

function html() {
  return gulp.src("./build/index.html").pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./build/index.html", html);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;

exports.build = build;
exports.watch = watch;
exports.default = build;