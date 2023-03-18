const gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    stylus = require('gulp-stylus'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    args = require('yargs').argv;

const settings = require("./settings.js");

gulp.task('pug', function(){
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;
    params = {
        str: PAGE
    }
    page_title = settings.capitalize(params);

    return gulp.src(settings.templates + PAGE + '/**/*.pug')
    .pipe(pug({
        pretty:true,
        data: {
            title: page_title, 
            prod: PROD,
        }
    }).on('error', function(e){
        console.log(["Message -> ", e.message]);
        console.log(["Plugin ->", e.plugin]);
    }).on('end', function(e){

    }))
    .pipe(gulp.dest(PATH + PAGE));
});

gulp.task('stylus', function () {
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;

    var plugins = [
        autoprefixer
    ];

    return gulp.src(settings.templates + PAGE + '/styles/styles.styl')
    .pipe(stylus(
        {
            compress: (PROD) ? true:false
        }
    ))
    .pipe(postcss(plugins))
    .on('error', function(err){
        console.log(err);
        console.log(["Message -> ", err.message]);
        console.log(["Plugin ->", err.plugin]);
    })
    .pipe(gulp.dest(PATH + PAGE + '/css'));
});

gulp.task('compress', function (cb) {
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;

    params = {
        str: PAGE
    }
    page_title = settings.capitalize(params);

    return gulp.src([settings.templates + PAGE + '/libs/*.js', settings.templates + PAGE + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest(settings.templates + PAGE + '/temp'))
        .pipe(replace('%LANDING%', page_title))
        .pipe(rename('main.js'))
        .pipe(uglify({
            mangle: false,
            compress: (PROD) ? true:false,
            output:{
                beautify: (PROD) ? false:true,
            },
        }).on('error', function(e){
            console.log(e.message);
            console.log(e.plugin);
        }))
        .pipe(gulp.dest(PATH + PAGE + '/js'));
});

gulp.task('default', function () {
    MYPATH = settings.landings;
    MYPAGE = args.land;
    console.log("Path --> ", MYPATH);
    console.log("Page --> ", MYPAGE);
    console.log("Prod --> ", args.prod);

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: MYPATH + MYPAGE
        }
    });

    gulp.watch(settings.templates + "**/*.pug", gulp.series(['pug'])).on("change", browserSync.reload);
    gulp.watch(settings.templates + "**/*.styl", gulp.series(['stylus'])).on("change", browserSync.reload);
    gulp.watch(settings.templates + "**/scripts/*.js", gulp.series(['compress'])).on("change", browserSync.reload);
});

gulp.task('imagemin', function() {
    var config = getData(args);
    console.log(config);
    return gulp.src(settings.templates+config.page+'/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.path+config.page+'/images'))
});

gulp.task('copyassets', function() {
    var dir = null,
    dirOutput = process.argv[4];
    _date = getWeekNumber(new Date());
    week = (_date[1]<9) ? "0"+_date[1]:_date[1];
    dir = "../" + _date[0] + "/" + week + "/"
    console.log('Coping assets into '+ dir + dirOutput);

    gulp.src('./assets/**/*')
    .pipe(gulp.dest(dir + dirOutput + "/"));
});