const { src, dest, watch, series } = require('gulp');
const rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    http = require('node:http'),
    stylus = require('stylus'),
    postcss = require('postcss'),
    autoprefixer = require('autoprefixer'),
    fs = require('node:fs'),
    path = require('node:path'),
    sharp = require('sharp');

const settings = require("./settings.js");
let landingName = settings.landingName,
    pathTemplate = settings.paths.template,
    pathLanding = settings.paths.landing;
let server;
let reloadClients = [];

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

const createCSS = async () => {
    const inputPath = path.join(pathTemplate, "styles", "styles.styl");
    const outputPath = path.join(pathLanding, "css", "styles.css");

    try {
        const styles = await fs.promises.readFile(inputPath, "utf8");
        const css = await new Promise((resolve, reject) => {
            stylus(styles)
                .set("filename", inputPath)
                .set("compress", settings.isProd)
                .render((err, result) => err ? reject(err) : resolve(result));
        });
        const result = await postcss([autoprefixer()]).process(css, {
            from: inputPath,
            to: outputPath,
            map: false
        });

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, result.css);
    } catch (err) {
        console.log(err);
        console.log(["Message -> ", err.message]);
        console.log(["Plugin ->", err.plugin]);
    }
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
exports.compress = createJS;

const watchLanding = (cb) => {
    console.log("Path --> ", pathLanding);
    console.log("Page --> ", landingName);
    console.log("Prod --> ", settings.isProd);

    try {
        fs.accessSync(pathTemplate, fs.constants.F_OK);
        console.log('Path exists');
        startServer(pathLanding);

        watch(pathTemplate + "/**/*.pug", series(createHTML, reload));
        watch(pathTemplate + "/**/*.styl", series(createCSS, reload));
        watch(pathTemplate + "/**/scripts/*.js", series(createJS, reload));
    } catch (err) {
        console.log(err.path, 'Landing not exist!');
    }
    cb();
}
exports.default = watchLanding

const createWebp = async () => {
    const imagesPath = path.join(pathLanding, "images");
    const validExtensions = new Set([".jpg", ".jpeg", ".png"]);

    try {
        const files = await fs.promises.readdir(imagesPath);
        await Promise.all(files.map(async (file) => {
            const extension = path.extname(file).toLowerCase();
            if (!validExtensions.has(extension)) return;

            const inputPath = path.join(imagesPath, file);
            const outputPath = path.join(imagesPath, path.basename(file, extension) + ".webp");
            await sharp(inputPath).webp().toFile(outputPath);
        }));
    } catch (e) {
        if (e.code === "ENOENT") {
            console.log("No images folder found in", imagesPath);
            return;
        }
        console.log('Error', e);
    }
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

const createSprite = async () => {
    const spritesPath = path.join(pathTemplate, "sprites");
    const cssLandingPath = path.join(pathLanding, "css");
    const spriteImagePath = path.join(cssLandingPath, "sprite.png");
    const spriteCssPath = path.join(cssLandingPath, "sprite.css");
    const spriteStylPath = path.join(pathTemplate, "styles", "sprite.styl");

    try {
        const files = (await fs.promises.readdir(spritesPath))
            .filter((file) => path.extname(file).toLowerCase() === ".png")
            .sort();

        if (files.length === 0) {
            console.log("No PNG sprites found in", spritesPath);
            return;
        }

        const sprites = await Promise.all(files.map(async (file) => {
            const filePath = path.join(spritesPath, file);
            const metadata = await sharp(filePath).metadata();

            return {
                name: path.basename(file, ".png"),
                filePath,
                width: metadata.width,
                height: metadata.height
            };
        }));

        const spriteWidth = sprites.reduce((sum, sprite) => sum + sprite.width, 0);
        const spriteHeight = Math.max(...sprites.map((sprite) => sprite.height));
        let offsetX = 0;

        const composite = sprites.map((sprite) => {
            const item = {
                input: sprite.filePath,
                left: offsetX,
                top: 0
            };
            sprite.x = offsetX;
            offsetX += sprite.width;
            return item;
        });

        await fs.promises.mkdir(cssLandingPath, { recursive: true });
        await fs.promises.mkdir(path.dirname(spriteStylPath), { recursive: true });
        await sharp({
            create: {
                width: spriteWidth,
                height: spriteHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite(composite)
            .png()
            .toFile(spriteImagePath);

        const css = sprites.map((sprite) => [
            `.icon-${sprite.name} {`,
            `  background-image: url('sprite.png');`,
            `  background-position: -${sprite.x}px 0;`,
            `  width: ${sprite.width}px;`,
            `  height: ${sprite.height}px;`,
            `}`
        ].join("\n")).join("\n\n") + "\n";

        await fs.promises.writeFile(spriteCssPath, css);
        await fs.promises.writeFile(spriteStylPath, css);
    } catch (e) {
        if (e.code === "ENOENT") {
            console.log("No sprites folder found in", spritesPath);
            return;
        }
        console.log('Error', e);
    }
}
exports.csssprite = createSprite;

function startServer(baseDir, port = 3000) {
    if (server) return;

    server = http.createServer((req, res) => serveRequest(req, res, baseDir));
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            server = null;
            startServer(baseDir, port + 1);
            return;
        }
        throw err;
    });
    server.listen(port, () => {
        console.log("Server --> http://localhost:" + port);
    });
}

async function serveRequest(req, res, baseDir) {
    const requestUrl = new URL(req.url, "http://localhost");

    if (requestUrl.pathname === "/__reload") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });
        res.write("\n");
        reloadClients.push(res);
        req.on("close", () => {
            reloadClients = reloadClients.filter((client) => client !== res);
        });
        return;
    }

    const basePath = path.resolve(baseDir);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const normalizedPath = pathname === "/" ? "index.html" : pathname.slice(1);
    let filePath = path.resolve(basePath, normalizedPath);

    if (filePath !== basePath && !filePath.startsWith(basePath + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    try {
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
            filePath = path.join(filePath, "index.html");
        }

        let content = await fs.promises.readFile(filePath);
        const contentType = getContentType(filePath);

        if (contentType === "text/html") {
            content = injectReloadScript(content.toString("utf8"));
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    } catch (err) {
        res.writeHead(404);
        res.end("Not found");
    }
}

function injectReloadScript(html) {
    const script = [
        "<script>",
        "(() => {",
        "  const source = new EventSource('/__reload');",
        "  source.onmessage = () => window.location.reload();",
        "})();",
        "</script>"
    ].join("");

    return html.includes("</body>")
        ? html.replace("</body>", script + "</body>")
        : html + script;
}

function getContentType(filePath) {
    const types = {
        ".css": "text/css",
        ".gif": "image/gif",
        ".html": "text/html",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".js": "text/javascript",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".woff": "font/woff",
        ".woff2": "font/woff2"
    };

    return types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function reload(done) {
    reloadClients.forEach((client) => client.write("data: reload\n\n"));
    done();
}
