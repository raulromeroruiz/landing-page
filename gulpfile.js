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
    fs = require('fs'),
    args = require('yargs').argv;

var dir = {
    templates: './templates/',
    landings: '../landings/'
};

var landing = '',
    now = new Date(),
    max_pastYears = 3;

gulp.task('pug', function(){
    //console.log(process.argv);
    var PAGE = "default";
    // PAGE = args.page;
    // console.log(PAGE);
    var config = getData(args),
        PATH = config.path,
        PAGE  = config.page,
        PROD = config.prod;
    console.log(config);
    params = {
        str: PAGE
    }
    // console.log(params);
    page_title = capitalize(params);

    return gulp.src(dir.templates + PAGE + '/**/*.pug')
    .pipe(pug({
        pretty:true,
        data: {
            title: page_title, 
            prod: PROD,
            // dev: (PROD) ? 'on':null
        }
    }).on('error', function(e){
        // console.log(e);
        console.log(["Message -> ", e.message]);
        console.log(["Plugin ->", e.plugin]);
    }).on('end', function(e){
        // console.log('Ending');
        // console.log(e);
    }))
    .pipe(gulp.dest(PATH + PAGE));
});

gulp.task('stylus', function () {
    var config = getData(args),
        PATH = config.path,
        PAGE  = config.page,
        PROD = config.prod;

    return gulp.src(dir.templates + PAGE + '/styles/styles.styl')
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

    return gulp.src([dir.templates + PAGE + '/libs/*.js',dir.templates + PAGE + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest(dir.templates + PAGE + '/temp'))
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
    console.log(args);
    // return false;
    var config = getData(args);
    // console.log(['config', config]);
    console.log("Path --> ", config.path);
    console.log("Page --> ", config.page);
    console.log("Prod --> ", config.prod);
    PATH = config.path;
    PAGE = config.page;
    // gulp.start('libsjs');
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: PATH + PAGE
        }
    });

    gulp.watch(dir.templates + "**/*.pug", ['pug']).on("change", browserSync.reload);
    gulp.watch(dir.templates + "**/*.styl", ['stylus']).on("change", browserSync.reload);
    gulp.watch(dir.templates + "**/*.js", ['compress']).on("change", browserSync.reload);
});

gulp.task('watch', function() {
    gulp.watch(dir.templates + "**/*.pug", ['pug']);
    gulp.watch(dir.templates + "**/*.styl", ['stylus']);
    gulp.watch(dir.templates + "**/*.js", ['compress']);
});

gulp.task('imagemin', function() {
    var config = getData(args);
    console.log(config);
    // console.log("Compress images --> ",dirOutput + "/images");
    return gulp.src(dir.templates+config.page+'/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.path+config.page+'/images'))
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

var MYTASK = null;
gulp.task('task', function() {
    // console.log(args);
    console.log(process.argv);
    // console.log(process.argv[3].replace("--",""));
    MYTASK = process.argv[3].replace("--","");
    date = getWeekNumber(new Date());
    landing = process.argv[4];
    // findYear(date);

    config = {
        landing: process.argv[4]
    }
    findLanding(config);
});

gulp.task('start', function(){
    //console.log('process.env -> ', process.env);
    console.log('args -> ', args);
    date = getWeekNumber(new Date());
    // landing = (args.land) ? args.land:process.env.land;
    landing = args.land;
    // findYear(date);

    config = {
        landing: args.land
    }
    findLanding(config);
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
    if (MYPATH) {
        // console.log('MYPATH -> ', MYPATH);
        return {
            path: MYPATH,
            page: MYPAGE,
            prod: (args.prod) ? true:false
        };
    }
    // Define Number Week
    _date = getWeekNumber(new Date());
    _week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    _week = (args.path!=null) ? args.path:_week;
    path = "../" + _date[0] + "/" + _week + "/";

    // Define name Landing Page
    page = args.land;

    // Define ENV
    prod = (args.prod) ? true:false;

    return {
        path: path,
        page: page,
        prod: prod
    }
}

var MYPATH = null,
    MYPAGE = null;
var findYear = function(params){
    _year = params[0];
    _yearPath = "../" + _year;
    if (!fs.existsSync(_yearPath)){
        console.log(_year, ' Año No existe!');
        _year--;
        _params = [_year, params[1]];

        console.log('_year -> ', _year);
        console.log('Limit -> ', now.getFullYear() - max_pastYears);
        if (_year < (now.getFullYear() - max_pastYears)) {
            console.log('Creating new landing...');
            gulp.start('default');
            return false;
        }
        findYear(_params);
        return false;
    }

    _week = params[1];
    cfg  = [_year, _week];
    findPath(cfg);
    return false;
}

var findPath = function(cfg) {
    _year = cfg[0];
    _week = cfg[1];
    path = "../" + _year + "/" + _week + "/";
    abspath = path + landing;
    if (!fs.existsSync(abspath)){
        console.log(path, ' -> ESTE PATH No existe!');
        _week--;
        if (_week>0) {
            cfg  = [_year, _week];
            findPath(cfg);
            //return false;
        }
        else {
            _year--;
            // _year = _year - 1;
            cfg = [_year, 52];
            findYear(cfg);
            return false;
        }
    }
    else {
        console.log(landing, ', existe en -> ', abspath);
        MYPATH = path;
        MYPAGE = landing;
        config = {
            page: landing,
            path: path
        }
        runLanding(config);
        return;
    }
    // console.log('path encontrado ' + path);
}

var runLanding = function(params) {
    console.log('params', params);
    console.log('MYPATH', MYPATH);
    console.log('MYTASK', MYTASK);
    _task = (args.task) ? args.task:"default";
    _task = (MYTASK) ? MYTASK:_task;
    gulp.start(_task);
}


var findLanding = function(params){
    console.log(params);
    _landing = params.landing;
    abspath = '../landings/' + _landing;
    if (!fs.existsSync(abspath)){
        console.log(_landing, ", not exist!");
    }
    else {
        // console.log("Run Landing", _landing);
        MYPATH = dir.landings;
        MYPAGE = _landing;
        config = {
            page: _landing,
            path: MYPATH
        }
        runLanding(config);
    }
}