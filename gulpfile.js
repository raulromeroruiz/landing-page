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
    fs = require('node:fs');

const settings = require("./settings.js");
let landingName = settings.landingName,
    pathTemplate = settings.paths.template,
    pathLanding = settings.paths.landing;

const createHTML = () => {
    return src([
            pathTemplate + '/*.pug',
            '!' + pathTemplate + '/includes/**',
            '!' + pathTemplate + '/layout/**'
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
        .pipe(dest(pathLanding));
}
exports.pug = createHTML;

const createCSS = () => {
    let plugins = [
        autoprefixer
    ];

    return src(pathTemplate + '/styles/styles.styl')
        .pipe(stylus(
            {
                compress: settings.isProd
            }
        ))
        .pipe(postcss(plugins))
        .on('error', function (err) {
            console.log(err);
            console.log(["Message -> ", err.message]);
            console.log(["Plugin ->", err.plugin]);
        })
        .pipe(dest(pathLanding + '/css'));
}
exports.stylus = createCSS;

const createJS = () => {
    return src([pathTemplate + '/libs/*.js', pathTemplate + '/scripts/*.js'])
        .pipe(
            concat('scripts.js').on('error', function (e) {
                console.log(e.message);
                console.log(e.plugin);
            }))
        .pipe(dest(pathTemplate + '/temp'))
        .pipe(replace('%LANDING%', settings.landingTitle))
        .pipe(rename('main.js'))
        .pipe(uglify({
            mangle: false,
            compress: settings.isProd,
            output: {
                beautify: !settings.isProd
            },
        }).on('error', function (e) {
            console.log(e.message);
            console.log(e.plugin);
        }))
        .pipe(dest(pathLanding + '/js'));
}
exports.uglify = createJS;

const watchLanding = (cb) => {
    console.log("Path --> ", pathLanding);
    console.log("Page --> ", landingName);
    console.log("Prod --> ", settings.isProd);

    try {
        fs.accessSync(pathLanding , fs.constants.F_OK);
        console.log('Path exists');
        // Serve files from the root of this project
        browserSync.init({
            server: {
                baseDir: pathLanding
            }
        });

        watch(pathTemplate + "/**/*.pug", series(['pug'])).on("change", browserSync.reload);
        watch(pathTemplate + "/**/*.styl", series(['stylus'])).on("change", browserSync.reload);
        watch(pathTemplate + "/**/scripts/*.js", series(['uglify'])).on("change", browserSync.reload);
    } catch (err) {
        console.log(err.path, 'Landing not exist!');
    }
    cb();
}
exports.default = watchLanding

const createWebp = () => {
    return src(pathLanding + "/images/*")
        .pipe(webp()
            .on("error", function (e) {
                console.log('Error', e);
            }))
        .pipe(dest(pathLanding + "/images/"));
}
exports.webp = createWebp;

const createLanding = (cb) => {
    console.log("Path --> ", pathLanding);
    console.log("Page --> ", landingName);
    console.log("Prod --> ", settings.isProd);
    let baseTemplates = settings.templates;

    // Create folder templates if not exist
    if (!fs.existsSync(baseTemplates)) {
        fs.mkdirSync(baseTemplates);
    }

    const suffixPattern = /-\d{1,2}$/;
    fs.readdir(baseTemplates, (err, folders) => {
        if (err) {
            console.log('Not found -> ', baseTemplates);
            return cb(err);
        }
        const myNewPage = [landingName];
        const rePage = new RegExp('^' + landingName + '(-[1-9]{1,2})?$', "g");
        const filter = folders.filter((landing) => landing.match(rePage)).sort();

        if (filter.length > 0) {
            console.log(landingName, 'exist!');
            const lastItem = filter[filter.length - 1];
            const match = lastItem.match(suffixPattern);
            const suffix = match ? Number(match[0].slice(1)) + 1 : 1;
            myNewPage.push(suffix);
        }
        createNewTemplate(myNewPage);
    });

    const createNewTemplate = (myTemplate) => {
        const getName = myTemplate.join("-");
        console.log('Creating landing ' + getName);
        return src(settings.master + 'landing/**/*')
            .pipe(dest(baseTemplates + getName))
            .on("error", (err) => console.log('error', err));
    }
    cb();
}
exports.create = createLanding;

const createSprite = (cb) => {
    let spriteData = src(pathTemplate + '/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        })
        .on('end', function (e) {
            console.log('end', e)
        })
    );
    return spriteData.pipe(dest(pathLanding + '/css'))
        .pipe(rename('sprite.styl'))
        .pipe(dest(pathTemplate + '/styles'));
}
exports.csssprite = createSprite;