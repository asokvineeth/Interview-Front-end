/* eslint-disable */
const gulp = require('gulp');
const twig = require('gulp-twig');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const glob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const browserSync = require('browser-sync');

gulp.task('twig', () => {
  return gulp
    .src('src/templates/index.html.twig')
    .pipe(twig())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});


gulp.task('sass', () => {
  return gulp
    .src('src/sass/*.scss')
    .pipe(glob())
    .pipe(
      sass({
        includePaths: ['./node_modules']
      })
    )
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('image', () => {
  return gulp.src('src/image/*').pipe(gulp.dest('dist/assets/image'));
});

gulp.task('dependencyJs', () => {
  return gulp
  .src(['node_modules/jquery/dist/jquery.min.js','node_modules/bootstrap/dist/js/bootstrap.min.js'])
  .pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('stylelint', () => {
  return gulp.src('src/sass/*.scss').pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }]
    })
  );
});

gulp.task('babel', () => {
  return gulp
    .src('src/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('eslint', () => {
  return gulp
    .src(['src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('browsersync', (done) => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(
    ['src/sass/**/*.scss','src/sass/*.scss','src/sass/*.html.twig', 'src/js/*.js'],
    gulp.series(['build', browserSync.reload])
  );
  done();
});

gulp.task('lint', gulp.series(['stylelint', 'eslint']));
gulp.task('build', gulp.series(['twig', 'sass', 'babel', 'image','dependencyJs']));
gulp.task('server', gulp.series([ 'build','browsersync']));

gulp.task('default', gulp.series(['lint', 'build']));
