var gulp = require('gulp'),
    rename = require('gulp-rename'),
    //replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    //watch = require('gulp-watch'),
    //source = require('./json/source.json');
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('autoprefixer-stylus'),
    stylus = require('gulp-stylus');

var paths = {
    templates: './master/*.pug',
};


gulp.task('pug', function(){
    //console.log(process.argv);
    _date = getWeekNumber(new Date());
    week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    week = (process.argv[6]!=null) ? process.argv[6]:week;
    dir = "../" + _date[0] + "/" + week + "/";
    var dirOutput = "default";
    dirOutput = process.argv[4];
    console.log("Week --> ",dir);
    console.log("Saving into --> ",dirOutput);

    params = {
        str: process.argv[4]
    }
    page_title = capitalize(params);
    
    return gulp.src('./templates/'+dirOutput+'/**/*.pug')
    .pipe(pug({
        pretty:true,
        data: {
            title: page_title, 
            dev: (process.argv[3]=="--dev") ? "dev":"prod",
            test: (process.argv[5]=="--dev") ? "dev":"prod",
        }
    }).on('error', function(e){
        // console.log(e);
        console.log(["Message -> ", e.message]);
        console.log(["Plugin ->", e.plugin]);
    }).on('end', function(e){
        console.log('Ending');
        // console.log(e);
    }))
    .pipe(gulp.dest(dir+dirOutput));
});

gulp.task('stylus', function () {
    _date = getWeekNumber(new Date());
    week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    week = (process.argv[6]!=null) ? process.argv[6]:week;
    dir = "../" + _date[0] + "/" + week + "/";
    var dirOutput = "default";
    
    dirOutput = process.argv[4];
    return gulp.src('./templates/'+dirOutput+'/styles/styles.styl')
    .pipe(stylus(
        {use: [autoprefixer('last 2 versions')]}
        ))
    .on('error', function(err){
        console.log(["Message -> ", err.message]);
        console.log(["Plugin ->", err.plugin]);
    })
    .pipe(gulp.dest(dir+dirOutput+'/css'));
});

gulp.task('compress', function (cb) {
    _date = getWeekNumber(new Date());
    week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    week = (process.argv[6]!=null) ? process.argv[6]:week;
    dir = "../" + _date[0] + "/" + week + "/";
    var dirOutput = "default";
    dirOutput = process.argv[4];
    console.log("Saving into --> ",dirOutput);
    return gulp.src(['./templates/'+dirOutput+'/libs/*.js','./templates/'+dirOutput+'/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function(e){
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest('./templates/'+dirOutput+'/temp'))
        .pipe(rename('main.js'))
        .pipe(uglify({
            mangle: false,
            compress: false,
            output:{
                beautify:true,
            },
        }).on('error', function(e){
            console.log(e.message);
            console.log(e.plugin);
        }))
        .pipe(gulp.dest(dir+dirOutput+'/js'));
});

gulp.task('default', function () {
    _date = getWeekNumber(new Date());
    week = (_date[1]<10) ? "0"+_date[1]:_date[1];
    week = (process.argv[6]!=null) ? process.argv[6]:week;
    dir = "../" + _date[0] + "/" + week + "/";
    dirOutput = process.argv[4];
    console.log("Saving into --> ",dir, dirOutput);
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: dir + dirOutput
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
    switch(process.argv[4]) {
        case "home":
            dirOutput = "ripley-home";
            break;
        case "versus":
            dirOutput = "versus";
            break;
        case "intel":
            dir  = '../2016/42/';
            dirOutput = "2x1-intel";
            break;
        case "deconavidad":
            dir  = '../2016/43/';
            dirOutput = "deconavidad";
            break;
        case "hp":
            dir  = '../2016/48/';
            dirOutput = "hp-multifuncional";
            break;
        case "dias-lg":
            dir  = '../2016/49/';
            dirOutput = "dias-lg";
            break;
        case "verano":
            dir  = '../2016/50/';
            dirOutput = "especial-verano";
            break;
        case "hogar":
            dir  = '../2017/02/';
            dirOutput = "especial-hogar";
            break;
        case "school":
            dir  = '../2017/04/';
            dirOutput = "back-2-school";
            break;
        case "adidas":
            dir  = '../2017/05/';
            dirOutput = "catalogo-adidas";
            break;
        case "valentin":
            dir  = '../2017/05/';
            dirOutput = "san-valentin";
            break;
    }
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