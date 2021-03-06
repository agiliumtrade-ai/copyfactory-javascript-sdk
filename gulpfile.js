const gulp = require('gulp');
const rename = require('gulp-rename');

exports.default = async function() {
  gulp.src('./lib/**/*.es6')
    .pipe(rename(function (path) {
      path.extname = '.js';
    }))
    .pipe(gulp.dest('./es'));
};
