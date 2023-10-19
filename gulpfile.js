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

gulp.task('pug', function(){
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;
    params = {
        str: PAGE
    }
    var page_title = settings.capitalize(params);

    var path_tpl_page = settings.templates + PAGE;
    return gulp.src([
        path_tpl_page + '/*.pug', 
        '!' + path_tpl_page + '/includes/**',
        '!' + path_tpl_page + '/layout/**'
    ]).pipe(pug({
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

gulp.task('webp', function() {
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;

    return gulp.src(PATH + PAGE + "/images/*")
        .pipe(webp()
            .on("error", function(e){
            console.log('Error', e);
        }))
        .pipe(gulp.dest(PATH + PAGE + "/images/"));
});

gulp.task('create', function(cb) {
    var TMPL = settings.templates,
        PAGE = args.land;
    
    // Create folder template if not exist
    if (!fs.existsSync(TMPL)){
        fs.mkdirSync(TMPL);
    }

    var suffix_pattern = /-\d{1,2}$/;
    fs.readdir(TMPL, function(err, folders){
        if (err) {
            console.log('Not found -> ', TMPL);
            return false;
        }
        var my_path = [PAGE],
            re = new RegExp('^' + PAGE + '(-[1-9]{1,2})?$', "g");
        var filtro = folders.filter((landing) => landing.match(re));
        filtro.sort();

        if (filtro.length > 0) {
            console.log(PAGE, 'exist!');
            var last_item = filtro[filtro.length-1];
            var have_suffix = last_item.match(suffix_pattern);
            var suffix = (!have_suffix) ? 1 : parseInt(have_suffix[0].replace("-","")) + 1;
            my_path.push(suffix);
        }
        createNewTemplate(my_path);
    });

    var createNewTemplate = function(my_template) {
        var getName = my_template.join("-");
        console.log('Creating landing ' + getName);
        return gulp.src(settings.master + 'landing/**/*')
            .pipe(gulp.dest(settings.templates + getName))
            .on("error", function(err){
                console.log('error', err);
            })
    }
    cb();
});

gulp.task('csssprite', function(cb) {
    var PATH = settings.landings,
        PAGE = args.land,
        PROD = args.prod;
    var spriteData = gulp.src(settings.templates + PAGE+ '/sprites/*.png')
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
        })
        .on('end', function(e){
            console.log('end', e)
        })
    );
    return spriteData.pipe(gulp.dest(PATH + PAGE + '/css'))
    .pipe(rename('sprite.styl'))
    .pipe(gulp.dest(settings.templates + PAGE + '/styles'));
    cb();
});