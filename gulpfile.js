'use strict';

var gulp = require ('gulp'),
    gp   = require ('gulp-load-plugins')();
var browserSync = require('browser-sync').create();


// Static server
gulp.task('serve', function() { // переименуем browser-sync в serve
    browserSync.init({
        server: {
            baseDir: "./build"  // здесь добавляем откуда он должен взять файлы
            }
        });
    browserSync.watch('build', browserSync.reload)  // добовляем эту строку сцелью чтобы browserSync отслеживал папку build и когда там будут изменения он перезагружал браузер
});


// add pug
gulp.task('pug', function(){
    return gulp.src('src/pug/pages/*.pug')
        .pipe(gp.pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});


// add stylus + autoprefixer
gulp.task('stylus', function(){
    return gulp.src('src/static/stylus/*.styl')
    // here you can add options from web site of this plugin between curly brackets (stylus)
        .pipe(gp.sourcemaps.init())
        .pipe(gp.stylus({}))
        .pipe(gp.autoprefixer({
            browsers: ['last 10 versions']
        }))
        .on("error",gp.notify.onError({
            title: "style"
        })) //
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/static/css'));
});

// add watch gulp.task('<путь тех файлов за которыми будем следить>',gulp.series ('<имя таска который должен исполнятся
// когда произошли какие-то изменения>')
//через масив ['....'] можно добавить несколько путей
gulp.task('watch', function(){
    gulp.watch('src/pug/**/*.pug',gulp.series('pug')); // после того как в папке c подпапками src/pug были сделаны изминения,
                                                      // будет вызван таск pug
    gulp.watch('src/static/**/*.styl',gulp.series('stylus'));
});

// запускаем порядок запуска тасков
gulp.task('default', gulp.series(
    gulp.parallel('pug','stylus'),    // запускаем паралельно/одновременно
    gulp.parallel('watch','serve')    // запускаем паралельно/одновременно
));

