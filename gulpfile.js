var gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('autoprefixer-stylus'),
    stylus = require('gulp-stylus'),
    fs = require('fs'),
    args = require('yargs').argv;

let workflow = {
    templates: './templates/',
    landings: '../landings/',
    capitalize: function(_params) {
        words = _params.str.split("-");
        for(x in words) {
            words[x] = words[x].charAt(0).toUpperCase() + words[x].slice(1);
        }
        return words.join(' ');
    }
};

var landing = '',
    now = new Date(),
    max_pastYears = 3;

gulp.task('pug', function(){
    var PATH = workflow.landings,
        PAGE = args.land,
        PROD = args.prod;
    params = {
        str: PAGE
    }
    page_title = workflow.capitalize(params);

    return gulp.src(workflow.templates + PAGE + '/**/*.pug')
    .pipe(pug({
        pretty:true,
        data: {
            title: page_title, 
            prod: PROD,
            // dev: (PROD) ? 'on':null
        }
    }).on('error', function(e){
        console.log(["Message -> ", e.message]);
        console.log(["Plugin ->", e.plugin]);
    }).on('end', function(e){

    }))
    .pipe(gulp.dest(PATH + PAGE));
});

gulp.task('stylus', function () {
    var PATH = workflow.landings,
        PAGE = args.land,
        PROD = args.prod;

    return gulp.src(workflow.templates + PAGE + '/styles/styles.styl')
    .pipe(stylus(
        {
            use: [autoprefixer('last 2 versions')],
            compress: (PROD) ? true:false
        }
    ))
    .on('error', function(err){
        console.log(err);
        console.log(["Message -> ", err.message]);
        console.log(["Plugin ->", err.plugin]);
    })
    .pipe(gulp.dest(PATH + PAGE + '/css'));
});

gulp.task('compress', function (cb) {
    var PATH = workflow.landings,
        PAGE = args.land,
        PROD = args.prod;

    params = {
        str: PAGE
    }
    page_title = workflow.capitalize(params);

    return gulp.src([workflow.templates + PAGE + '/libs/*.js',workflow.templates + PAGE + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest(workflow.templates + PAGE + '/temp'))
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
    MYPATH = workflow.landings;
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

    gulp.watch(workflow.templates + "**/*.pug", gulp.series(['pug'])).on("change", browserSync.reload);
    gulp.watch(workflow.templates + "**/*.styl", gulp.series(['stylus'])).on("change", browserSync.reload);
    gulp.watch(workflow.templates + "**/scripts/*.js", gulp.series(['compress'])).on("change", browserSync.reload);
});

gulp.task('imagemin', function() {
    var config = getData(args);
    console.log(config);
    return gulp.src(workflow.templates+config.page+'/images/*')
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