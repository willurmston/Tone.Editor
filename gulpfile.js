var fs = require('fs')
var del = require('del')
var gulp = require('gulp')
var rename = require('gulp-rename')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var changed = require('gulp-changed')
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var webpack_config = require('./webpack.config.js');


// first delete build directory
del.sync(['build'])

// gulp.task('scripts', function() {
//   // Minify and copy all JavaScript (except vendor scripts)
//   // with sourcemaps all the way down
//   return gulp.src('js/*.js')
//     .pipe(sourcemaps.init())
//       .pipe(uglify())
//       .pipe(concat('Tone-Editor.min.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build'))
// })

gulp.task('webpack', function() {
  return webpackStream(webpack_config, webpack)
    .pipe(gulp.dest('./build'))

    // .pipe(uglify())
    // .pipe(rename({
    //     suffix: '.min'
    // }))
    // .pipe(gulp.dest('./build/'))
});

// gulp.task('sass', function () {
//   return gulp.src('./sass/**/*.sass')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./build'));
// });

// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/*.sass', ['sass']);
// });

// Rerun a task when a file changes
gulp.task('watch', function() {
  gulp.watch('ToneEditor/**', ['webpack'])
  // gulp.watch('ToneEditor/Utils/*', ['webpack'])
  // gulp.watch('ToneEditor/Templates/*', ['webpack'])
  // gulp.watch('ToneEditor/libs/*', ['webpack'])
  // gulp.watch('ToneEditor/sass/*', ['webpack'])
  // gulp.watch('ToneEditor/img/*', ['webpack'])
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'webpack'])

process.on('uncaughtException', function(error) {
  if (error.cause !== undefined) {
    console.log(error.cause);

  } else {
    console.log(error)
  }
    process.exit(1)
})


// gulp.task('default', function() {
//   return gulp.src('src/entry.js')
//     .pipe()
//     .pipe(gulp.dest('dist/'));
// });
