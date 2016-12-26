var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    ts = require("gulp-typescript"),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    gzip = require('gulp-gzip');
    //livereload = require('gulp-livereload'),
    del = require('del'),
    gulpUtil = require('gulp-util');

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var directoryProject = ts.createProject("mytsconfig.json");

gulp.task('prod_styles', function() {
  return gulp.src('web/assets/css/**/*.css')
    //.pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gzip())
    .pipe(gulp.dest('web/assets/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return gulp.src('src/front-end/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))    
    .pipe(gulp.dest('web/assets/css'));
});

gulp.task('prod_js', function() {
  return gulp.src(['web/js/*.js'])
    //.pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gzip())
    //.pipe(minify())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify().on('error', gulpUtil.log)) // notice the error event here
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('web/js'));
});

gulp.task("scriptsDirectory2", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/front-end/js/directory/app.module.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("web/js"));
});

gulp.task('scriptsDirectory', function() {
  return directoryProject.src()
        .pipe(directoryProject())
        .pipe(concat('directory.js'))
        .pipe(gulp.dest('web/js'));

  // return gulp.src(['src/front-end/js/directory/**/*.js', 'src/front-end/js/commons/**/*.js'])
  //   .pipe(ts())
  //   // .pipe(jshint())
  //   // .pipe(jshint.reporter('default'))
  //   // .pipe(jshint.reporter('fail'))
  //   // .on('error', notify.onError({ message: 'JS hint fail'}))
  //   .pipe(concat('directory.js'))
  //   //.pipe(livereload())
  //   .pipe(gulp.dest('web/js'));
});


gulp.task('scriptsElementForm', function() {
  return gulp.src(['src/front-end/js/element-form/**/*.js','src/front-end/js/commons/commons.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('element-form.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsHome', function() {
  return gulp.src(['src/front-end/js/home/**/*.js','src/front-end/js/commons/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError({ message: 'JS hint fail'}))
    .pipe(concat('home.js'))
    //.pipe(livereload())
    .pipe(gulp.dest('web/js'));
});

gulp.task('scriptsLibs', function() {
  return gulp.src(['src/front-end/js/libs/**/*.js', '!src/front-end/js/libs/materialize/unused/**/*.js'])
    .pipe(concat('libs.js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('web/js'));
    //.pipe(livereload());
    //.pipe(notify({ message: 'Scripts Libs task complete' }));
});

// test
gulp.task('typescript', function() {
  return coreTsProject.src()
        .pipe(coreTsProject())
        .pipe(gulp.dest('web/js'));
  // return gulp.src('src/front-end/js/index.ts')
  //       .pipe(ts({
  //           noImplicitAny: true,
  //           out: 'output.js'
  //       }))
  //       .pipe(gulp.dest('built/local'));
});

gulp.task('images', function() {
  return gulp.src('web/assets/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('web/assets/imgMin'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('watch', function() {

  //livereload.listen();
  // Watch .scss files
  gulp.watch('src/front-end/scss/**/*.scss', ['sass']);

  // Watch .js files
  gulp.watch(['src/front-end/js/**/*.js', '!src/front-end/js/libs/**/*.js', '!src/front-end/js/home/**/*.js', '!src/front-end/js/element-form/**/*.js'], ['scriptsDirectory']);
  
  gulp.watch(['src/front-end/js/element-form/**/*.js','src/front-end/js/commons.js'], ['scriptsElementForm']);
  
  gulp.watch('src/front-end/js/libs/**/*.js', ['scriptsLibs']);

  gulp.watch(['src/front-end/js/home/**/*.js','src/front-end/js/commons.js','src/front-end/js/components/search-bar.js'], ['scriptsHome']);
  // Watch image files
  //gulp.watch('src/img/*', ['images']);


});

gulp.task('clean', function(cb) {
    del(['web/assets/css', 'web/js'], cb);
});

gulp.task('build', function() {
    gulp.start('clean','sass', 'scriptsLibs', 'scriptsHome', 'scriptsElementForm','scriptsDirectory');
});

gulp.task('production', function() {
    gulp.start('build','prod_styles', 'prod_js');
});

