const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imgMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/some.css',
    './src/css/other.css'
];

const jsFiles = [
    './src/js/lib.js',
    './src/js/some.js',
    './src/image/*'
]

const img = [
    './src/image/img'
]
function styles() {
        return gulp.src(cssFiles, { allowEmpty: true })
                    .pipe(concat('all.css'))
                    .pipe(autoprefixer({
                        overrideBrowserslist: ['> 0.01%'],
                        cascade: false
                    }))
                    .pipe(cleanCSS({
                       level: 2
                    }))
                    .pipe(gulp.dest('./build/css'))
                    .pipe(browserSync.stream());
}
function script() {
        return gulp.src(jsFiles)
            .pipe(concat('all.js'))
            .pipe(uglify({
                toplevel: true
            }))
            .pipe(gulp.dest('./build/js'))
            .pipe(browserSync.stream());
}
function image(){
    return gulp.src('./src/image/**/*.jpg')
        .pipe(imgMin())
        .pipe(gulp.dest('./build/img'))

}
function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "./src/index.html"
        }
        // tunnel: true
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', script);
    gulp.watch('./src/*.html', browserSync.reload);
}

function clean() {
    return del('build/*')
}
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('image', image);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean,
                        gulp.parallel(styles, script, image)));

gulp.task('dev', gulp.series('build', 'watch'));
