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
    webp = require('gulp-webp'),
    args = require('yargs').argv,
    spritesmith = require('gulp.spritesmith'),
    fs = require('fs');

const settings = require("./settings.js");

// Global vars
var PAGE = args.land,
    PROD = args.prod,
    pathTemplate = settings.templates + PAGE,
    pathLanding = settings.landings + PAGE;

gulp.task('pug', function () {
    return gulp.src([
            pathTemplate + '/*.pug',
            '!' + pathTemplate + '/includes/**',
            '!' + pathTemplate + '/layout/**'
        ]).pipe(pug({
            pretty: true,
            data: {
                title: settings.pageTitle(PAGE),
                prod: PROD,
            }
            }).on('error', function (e) {
                console.log(["Message -> ", e.message]);
                console.log(["Plugin ->", e.plugin]);
            }).on('end', function (e) {
        }))
        .pipe(gulp.dest(pathLanding));
});

gulp.task('stylus', function () {
    let plugins = [
        autoprefixer
    ];

    return gulp.src(pathTemplate + '/styles/styles.styl')
        .pipe(stylus(
            {
                compress: (PROD) ? true : false
            }
        ))
        .pipe(postcss(plugins))
        .on('error', function (err) {
            console.log(err);
            console.log(["Message -> ", err.message]);
            console.log(["Plugin ->", err.plugin]);
        })
        .pipe(gulp.dest(pathLanding + '/css'));
});

gulp.task('compress', function (cb) {
    return gulp.src([pathTemplate + '/libs/*.js', pathTemplate + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function (e) {
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(gulp.dest(pathTemplate + '/temp'))
        .pipe(replace('%LANDING%', settings.pageTitle(PAGE)))
        .pipe(rename('main.js'))
        .pipe(uglify({
            mangle: false,
            compress: (PROD) ? true : false,
            output: {
                beautify: (PROD) ? false : true,
            },
        }).on('error', function (e) {
            console.log(e.message);
            console.log(e.plugin);
        }))
        .pipe(gulp.dest(pathLanding + '/js'));
});

gulp.task('default', function () {
    console.log("Path --> ", pathLanding);
    console.log("Page --> ", PAGE);
    console.log("Prod --> ", PROD);

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: pathLanding
        }
    });

    gulp.watch(pathTemplate + "/**/*.pug", gulp.series(['pug'])).on("change", browserSync.reload);
    gulp.watch(pathTemplate + "/**/*.styl", gulp.series(['stylus'])).on("change", browserSync.reload);
    gulp.watch(pathTemplate + "/**/scripts/*.js", gulp.series(['compress'])).on("change", browserSync.reload);
});

gulp.task('webp', function () {
    return gulp.src(pathLanding + "/images/*")
        .pipe(webp()
            .on("error", function (e) {
                console.log('Error', e);
            }))
        .pipe(gulp.dest(pathLanding + "/images/"));
});

gulp.task('create', function (cb) {
    console.log(PAGE);
    console.log(pathLanding);
    console.log(pathTemplate);
    let TMPL = settings.templates;

    // Create folder templates if not exist
    if (!fs.existsSync(TMPL)) {
        fs.mkdirSync(TMPL);
    }

    let suffixPattern = /-\d{1,2}$/;
    fs.readdir(TMPL, function (err, folders) {
        if (err) {
            console.log('Not found -> ', TMPL);
            return false;
        }
        let myNewPage = [PAGE],
            rePage = new RegExp('^' + PAGE + '(-[1-9]{1,2})?$', "g");
        let filter = folders.filter((landing) => landing.match(rePage));
        filter.sort();

        if (filter.length > 0) {
            console.log(PAGE, 'exist!');
            let lastItem = filter[filter.length - 1];
            let haveSuffix = lastItem.match(suffixPattern);
            let suffix = (!haveSuffix) ? 1 : parseInt(haveSuffix[0].replace("-", "")) + 1;
            myNewPage.push(suffix);
        }
        createNewTemplate(myNewPage);
    });

    const createNewTemplate = function (myTemplate) {
        let getName = myTemplate.join("-");
        console.log('Creating landing ' + getName);
        return gulp.src(settings.master + 'landing/**/*')
            .pipe(gulp.dest(settings.templates + getName))
            .on("error", function (err) {
                console.log('error', err);
            })
    }
    cb();
});

gulp.task('csssprite', function (cb) {
    let spriteData = gulp.src(pathTemplate + '/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        })
        .on('end', function (e) {
            console.log('end', e)
        })
    );
    return spriteData.pipe(gulp.dest(pathLanding + '/css'))
        .pipe(rename('sprite.styl'))
        .pipe(gulp.dest(pathTemplate + '/styles'));
    cb();
});