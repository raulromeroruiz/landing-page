const { src, dest, watch, series } = require('gulp');
const rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    stylus = require('gulp-stylus'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    webp = require('gulp-webp'),
    spritesmith = require('gulp.spritesmith'),
    fs = require('fs');

const settings = require("./settings.js");
let PAGE = settings.PAGE,
    PROD = settings.isProd,
    pathTemplates = settings.paths.templates,
    pathLandings = settings.paths.landings;

const createHTML = () => {
    return src([
            pathTemplates + '/*.pug',
            '!' + pathTemplates + '/includes/**',
            '!' + pathTemplates + '/layout/**'
        ]).pipe(pug({
            pretty: true,
            data: {
                title: settings.landingTitle,
            }
            }).on('error', function (e) {
                console.log(["Message -> ", e.message]);
                console.log(["Plugin ->", e.plugin]);
            }).on('end', function (e) {
        }))
        .pipe(dest(pathLandings));
}
exports.pug = createHTML;

const createCSS = () => {
    let plugins = [
        autoprefixer
    ];

    return src(pathTemplates + '/styles/styles.styl')
        .pipe(stylus(
            {
                compress: settings.compressCSS
            }
        ))
        .pipe(postcss(plugins))
        .on('error', function (err) {
            console.log(err);
            console.log(["Message -> ", err.message]);
            console.log(["Plugin ->", err.plugin]);
        })
        .pipe(dest(pathLandings + '/css'));
}
exports.stylus = createCSS;

const createJS = () => {
    return src([pathTemplates + '/libs/*.js', pathTemplates + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function (e) {
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(dest(pathTemplates + '/temp'))
        .pipe(replace('%LANDING%', settings.landingTitle))
        .pipe(rename('main.js'))
        .pipe(uglify({
            mangle: false,
            compress: settings.compressJS,
            output: {
                beautify: settings.beautifyJS,
            },
        }).on('error', function (e) {
            console.log(e.message);
            console.log(e.plugin);
        }))
        .pipe(dest(pathLandings + '/js'));
}
exports.uglify = createJS;

const watchLanding = () => {
    console.log("Path --> ", pathLandings);
    console.log("Page --> ", PAGE);
    console.log("Prod --> ", PROD);

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: pathLandings
        }
    });

    watch(pathTemplates + "/**/*.pug", series(['pug'])).on("change", browserSync.reload);
    watch(pathTemplates + "/**/*.styl", series(['stylus'])).on("change", browserSync.reload);
    watch(pathTemplates + "/**/scripts/*.js", series(['uglify'])).on("change", browserSync.reload);
}
exports.default = watchLanding

const createWebp = () => {
    return src(pathLandings + "/images/*")
        .pipe(webp()
            .on("error", function (e) {
                console.log('Error', e);
            }))
        .pipe(dest(pathLandings + "/images/"));
}
exports.webp = createWebp;

const createLanding = (cb) => {
    console.log("Path --> ", pathLandings);
    console.log("Page --> ", PAGE);
    console.log("Prod --> ", PROD);
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
        return src(settings.master + 'landing/**/*')
            .pipe(dest(settings.templates + getName))
            .on("error", function (err) {
                console.log('error', err);
            })
    }
    cb();
}
exports.create = createLanding;

const createSprite = (cb) => {
    let spriteData = src(pathTemplates + '/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        })
        .on('end', function (e) {
            console.log('end', e)
        })
    );
    return spriteData.pipe(dest(pathLandings + '/css'))
        .pipe(rename('sprite.styl'))
        .pipe(dest(pathTemplates + '/styles'));
}
exports.csssprite = createSprite;