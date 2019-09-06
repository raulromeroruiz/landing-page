var gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    //watch = require('gulp-watch'),
    //source = require('./json/source.json');
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    // imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('autoprefixer-stylus'),
    stylus = require('gulp-stylus'),
    args = require('yargs').argv;

var paths = {
    templates: './master/*.pug',
};


gulp.task('pug', function(){
    //console.log(process.argv);
    var PAGE = "default";
    // PAGE = args.page;
    // console.log(PAGE);
    var config = getData(args),
        PATH = config.path,
        PAGE  = config.page,
        PROD = config.prod;
    console.log(PROD);
    params = {
        str: PAGE
    }
    // console.log(params);
    page_title = capitalize(params);

    return gulp.src('./templates/' + PAGE + '/**/*.pug')
    .pipe(pug({
        pretty:true,
        data: {
            title: page_title, 
            mode: (PROD) ? "prod":"dev",
            dev: ":: DEVELOPER ::"
            // dev: (process.argv[3]=="--dev") ? "dev":"prod",
            // test: (process.argv[5]=="--dev") ? "dev":"prod",
        }
    }).on('error', function(e){
        // console.log(e);
        console.log(["Message -> ", e.message]);
        console.log(["Plugin ->", e.plugin]);
    }).on('end', function(e){
        console.log('Ending');
        // console.log(e);
    }))
    .pipe(gulp.dest(PATH + PAGE));
});

gulp.task('stylus', function () {
    var config = getData(args),
        PATH = config.path,
        PAGE  = config.page,
        PROD = config.prod;

    return gulp.src('./templates/' + PAGE + '/styles/styles.styl')
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
    var config = getData(args),
        PATH = config.path,
        PAGE  = config.page,
        PROD = config.prod;

    params = {
        str: PAGE
    }
    page_title = capitalize(params);

    return gulp.src(['./templates/' + PAGE + '/libs/*.js','./templates/' + PAGE + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest('./templates/' + PAGE + '/temp'))
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
    /**/
});

gulp.task('default', function () {
    // console.log(args);
    // console.log(process.argv);
    // return false;
    var config = getData(args);
    // console.log(['config', config]);
    console.log("Path --> ",config.path);
    console.log("Page --> ",config.page);
    console.log("Prod --> ",config.prod);
    PATH = config.path;
    PAGE = config.page;
    // gulp.start('libsjs');
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: PATH + PAGE
        }
    });

    gulp.watch("./templates/**/*.pug", ['pug']).on("change", browserSync.reload);
    gulp.watch("./templates/**/*.styl", ['stylus']).on("change", browserSync.reload);
    gulp.watch("./templates/**/*.js", ['compress']).on("change", browserSync.reload);
});

gulp.task('watch', function() {
    gulp.watch("./templates/**/*.pug", ['pug']);
    gulp.watch("./templates/**/*.styl", ['stylus']);
    gulp.watch("./templates/**/*.js", ['compress']);
});

gulp.task('imagemin', function() {
    console.log(process.argv[4]);
    
    console.log("Compress images --> ",dirOutput + "/images");
    return gulp.src('./templates/'+dirOutput+'/images')
        .pipe(imagemin())
        .pipe(gulp.dest(dir+dirOutput+'/images'))
});

gulp.task('mycss', function () {
    gulp.start('copyassets');
});

gulp.task('copyassets', function() {
    var dir = null,
    dirOutput = process.argv[4];
    _date = getWeekNumber(new Date());
    week = (_date[1]<9) ? "0"+_date[1]:_date[1];
    dir = "../" + _date[0] + "/" + week + "/"
    // console.log(process.argv);
    console.log('Coping assets into '+ dir + dirOutput);

    gulp.src('./assets/**/*')
    .pipe(gulp.dest(dir + dirOutput + "/"));
});

gulp.task('libsjs', function() {
    console.log('Generating js libs');
    // Generate js for plugins
    return gulp.src(['./templates/'+dirOutput+'/libs/*.js'])
        .pipe(
            concat('libs.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest('./templates/'+dirOutput+'/temp'))
        // .pipe(rename('lib.js'))
        .pipe(gulp.dest(dir+dirOutput+'/js'));
});

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}

function capitalize(_params) {
    words = _params.str.split("-");
    for(x in words) {
        words[x] = words[x].charAt(0).toUpperCase() + words[x].slice(1);
    }
    //return _params.str.charAt(0).toUpperCase() + _params.str.slice(1).replace(/\-/g," ");
    return words.join(' ');
}

function getData(params) {
    // console.log(params);
    // Define Number Week
    _date = getWeekNumber(new Date());
    _week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    _week = (args.path!=null) ? args.path:_week;
    path = "../" + _date[0] + "/" + _week + "/";

    // Define name Landing Page
    page = args.page;

    // Define ENV
    prod = (args.prod) ? true:false;

    return {
        path: path,
        page: page,
        prod: prod
    }
}