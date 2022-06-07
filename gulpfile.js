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

gulp.task('watch', function() {
    gulp.watch(workflow.templates + "**/*.pug", ['pug']);
    gulp.watch(workflow.templates + "**/*.styl", ['stylus']);
    gulp.watch(workflow.templates + "**/*.js", ['compress']);
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

var MYTASK = null;
gulp.task('task', function() {
    console.log(args);
    console.log('--------------------------------');
    console.log(process.argv);
    MYTASK = process.argv[3].replace("--","");
    // date = getWeekNumber(new Date());
    landing = process.argv[4];

    MYTASK = args.task;
    landing = args.land

    config = {
        landing: args.land
    }
    findLanding(config);
});

gulp.task('start', function(){
    landing = args.land;

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

function getData(params) {
    if (MYPATH) {
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
            server();
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
        }
        else {
            _year--;
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
}

var findLanding = function(params){
    console.log(params);
    _landing = params.landing;
    _path = workflow.landings;
    abspath = _path + _landing;
    if (!fs.existsSync(abspath)){
        console.log(_landing, ", not exist!");
    }
    else {
        MYPATH = _path;
        MYPAGE = _landing;
        config = {
            page: _landing,
            path: MYPATH
        }
        runLanding(config);
    }
}

var runLanding = function(params) {
    console.log('params', params);
    console.log('Task', MYTASK);
    _task = (args.task) ? args.task:"default";
    _task = (MYTASK) ? MYTASK:_task;
    gulp.start(_task);
}

var server = function(){
    var config = getData(args);
    console.log("Path --> ", config.path);
    console.log("Page --> ", config.page);
    console.log("Prod --> ", config.prod);
    PATH = config.path;
    PAGE = config.page;
    
    browserSync.init({
        server: {
            baseDir: PATH + PAGE
        }
    });

    gulp.watch(workflow.templates + "**/*.pug", ['pug']).on("change", browserSync.reload);
    gulp.watch(workflow.templates + "**/*.styl", ['stylus']).on("change", browserSync.reload);
    gulp.watch(workflow.templates + "**/*.js", ['compress']).on("change", browserSync.reload);
}