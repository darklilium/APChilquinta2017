var gulp = require('gulp');
var sass = require('gulp-sass');
var swig = require('gulp-swig');
var notify = require("gulp-notify");


function defaultError(type){
  return function(err){
    console.log(type + ' error : ' + err);
  };
}

function dist(path){
  return './dist/' + path;
}

function realPath(xs){
  return './src/app/' + xs;
}

var reportError = function (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());

    this.emit('end');
}

gulp.task('sass', function(){
  return gulp.src('./src/app/css/components_css/*.scss')
    .pipe(sass({ outputStyle: 'compact' }))
    .on('error', reportError)
    .pipe(gulp.dest(dist('css')))
});

gulp.task('css', function(){
  return gulp.src('./src/app/css/*.css')
    .pipe(sass({ outputStyle: 'compact' }))
    .on('error', reportError)
    .pipe(gulp.dest(dist('css')))
});


gulp.task('libs', function(){
  return gulp.src('./src/app/vendor/*.js')
    .pipe(gulp.dest(dist('js/vendor')));
});


gulp.task('images', function(){
  return gulp.src('./src/app/css/images/**/*.png')
    .on('error', reportError)
    .pipe(gulp.dest(dist('css/images')))

});
gulp.task('images2', function(){
  return gulp.src('./src/app/css/images/**/*.jpg')
    .on('error', reportError)
    .pipe(gulp.dest(dist('css/images')))

});

gulp.task('watch', function(){
  gulp.watch(['css/components_css/**/*.scss'].map(realPath), ['sass']);
});


gulp.task('default', ['sass', 'libs', 'images','images2','watch', 'css']);
