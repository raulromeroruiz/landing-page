# Workflow for Landing Pages
This flow use Node.js and Gulp to create landing pages, quickly and easily. This process automatize tasks to generate html files (with pugjs), css files (with stylus) and optimize js files (with uglify).  
The layout use Bootstrap v4 how grid base and [Slick](https://kenwheeler.github.io/slick/) for slider function.

## Requirements
- Node.js 14.15.0 (If you have another version top, can use [nvm](https://github.com/nvm-sh/nvm))
- Gulp Cli 2.2.0 (Until last update this doc)
- Gulp 4.0.2 (Until last update this doc)
- Browsersync
- Yargs
- PugJS
- Stylus
- Autoprefixer


## Install Repo
Clone repository  
> git clone git@github.com:raulromeroruiz/landing-page.git  

Into folder landing-page (or folder where cloned), run command
> npm install


## Templates Directory

**Manual Steps**
1. In the proyect root, create folder named **templates**.  
2. From master folder, copy "*landing*" folder to templates folder and rename to **my-first-page** (can rename to another).

_Note: Use only chars alphanumeric and dash for template name._

**Using Task**  
For generate the landing template run task **create**  
```
gulp create --land my-first-landing
```

Result
```javascript
[12:25:45] Starting 'create'...
[12:25:45] Finished 'create' after 3.25ms
Creating landing my-first-landing
```

If "my-first-landing" exist, new folder is created adding a number to name.  
> my-first-landing-1  
> my-first-landing-2  
> ...

**Folders tree detail**  
Using either method, the following structure is created
```
landing-pages
	├── master
	|	└── landing
	└── templates
		└── my-first-page
			├── styles
			|   └── *.styl
			├── scripts
			|   └── *.js
			├── libs
			|   └── *.js
			├── includes
			|   └── *.pug
			├── layout
			|   └── *.pug
			├── sprites
			|   └── *.(jpg|png)
			└── index.pug

```

### Directory descriptions

_**layout**_
: Main template Pug file for landing page.

_**includes**_
: Pug files, for header and footer sections. Mixins, functions and vars for pug files.

_**styles**_
: Files for stylus pre-proccesor (_*.styl_)

_**scripts**_
: Javascript files. For javascript code.

_**libs**_
: Javascript files librarys (jQuery, plugins, etc)

_**sprites**_
: Image sprite files. (Not available)

## Tasks
View all tasks
> gulp --tasks

#### default
Process all tasks and run the local server.  
It also executes the watch task to listen to files changes (pug, js, styl) and run the corresponding task.

#### pug
Process all files *.pug* to *.html*

#### stylus
All files are imported to file styles.styl:
``` 
@import "fonts.styl"
@import "main.styl"
@import "mediaqueries.styl"
...
...
@import "sprite.styl"
@import "keyframes.styl"
@import "other-files.styl"
```
Finally file styles.styl is converted to styles.css

#### compress
Process all **js** files.  
This combine, optimize and minify js files (from libs & scripts folders) into single javascript file

#### webp
Convert the image files to webp format.  
```javascript
image1.jpg -> image1.webp  
image2.png -> image2.webp
```

Steps  

- First create "images" folder into "landings/my-first-page" and put image files (jpg or png).  
- In pug template use the mixin "**picture('filename.ext')**" instead of html tag img. Can use both at once.
```
+picture('image1.jpg')
+picture('image2.png')
...
+picture('imageX.png')
```
- This mixin is located in the file templates/my-first-page/includes/mixins.pug  
When task run **pug**, this is generated:
```
<picture>
	<source srccet="images/image1.webp" type="images/webp">
	<source srccet="images/image1.jpg" type="images/jpg">
	<img src="images/image1.jpg">
</picture>
```
- If mixin no exist, pull lasts changes and copy file mixins.pug from _**master/landing/includes**_ to _**templates/folder-landing/includes**_ (In this example the folder-landing is my-first-page)
- Another alternative is use rewrite rules, PHP and Apache Server
	- [Wamp Server](https://sourceforge.net/projects/wampserver/)
	- Put folder landing to folder public from local server and rename index.html to index.php
	- Create .htaccess file into landing folder root and use this code: [Apache htaccess Webp](https://www.askapache.com/htaccess/serving-webp-images-for-png-jpg/#Apache_Htaccess_WebP)
- After run task webp, verify the performance with [lighthouse](https://developer.chrome.com/docs/lighthouse/overview/#devtools)

## Run workflow
We have the **my-first-page** folder into templates, so run:

> gulp default --land ``my-first-page``

- For parameter ``--land`` set folder name (remember this example is my-first-page) where saved files and assets


### Root Path Files
When run gulp default..., show three options: Path, Page and Prod.
```javascript
[11:43:27] Starting 'default'...
...
...
Path -->  ../landings/
Page -->  my-first-page
Prod -->  false
...
```

This command generate the folder *template-dir* (this case my-first-page)  
Up two levels. Check path: **landings\my-first-page**  

```
	├── landings
	|	└── my-first-page
	|		└── index.html
	└── workflow
		└── templates
			├── my-first-page
			|	└── index.pug
			├── .gitignore
			├── gulpfile.js
			├── package.json
			└── README.md
```

#### Check
1. The browser should launched with URL: http://localhost:3000/my-first-page  
2. If not show some content, change and save some pug file.  
3. Also do the same for others files (styl or js).  
4. For every change, Browsersync reload to browser

## Execute tasks independently

_**pug**_
> gulp pug --land ``my-first-page``

_**stylus**_
> gulp stylus --land ``my-first-page``

_**compress**_
> gulp compress --land ``my-first-page``

_**webp**_
> gulp webp --land ``my-first-page``


## Production Mode

Compress and minimize files.  
Add param **--prod** when execute task

> gulp stylus --land my-first-page **--prod**  
> gulp compress --land my-first-page **--prod**

`This param its only available for the tasks`**`stylus`**` and `**`compress`**
