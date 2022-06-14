# Work Flow Landing Page
This flow use Node.js and gulpjs to create landing pages, quickly and easily. This process automatize tasks to generate html files (with pugjs), css files (with stylus) and optimize js files (with uglify).  
This layout use Bootstrap v4 how grid base and [Slick](https://kenwheeler.github.io/slick/) for slider function.

## Requirements
- Node.js 12.0.0 (If you have another version top, can use [nvm](https://github.com/nvm-sh/nvm))
- Gulp Cli 4.0.5
- Browser Sync
- Yargs
- Autoprefixer


## Install Repo
Clone repository  
> git clone git@github.com:raulromeroruiz/landing-page.git  

Into folder landing-page (or folder where cloned), run command
> npm install


## Templates Directory

First: In the proyect root, create folder named **templates**.  
Second: From master folder, copy "landing" dir into folder templates and rename to my-first-page (can rename to another).  
**Tree folders** detail

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
### default
Process all tasks and run the local server.  
It also executes the watch task to listen to change files (pug, js, styl) and run the corresponding task.

### pug
Process all files *.pug* to *.html*

### stylus
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

### compress
Process all **js** files.  
Combine, optimize and minify js source (libs & scripts folders) into javascript unique file


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

This workflow generate folder *template-dir* (this case my-first-page)  
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

Launch the browser with URL: http://localhost:3000/my-first-page  
If not show some content, change and save some pug file.  
Also do the same for others files (styl or js).


## Execute tasks independently

_**Pug**_
> gulp pug --land ``my-first-page``

_**Stylus**_
> gulp stylus --land ``my-first-page``

_**Compress**_
> gulp compress --land ``my-first-page``



## Production Mode

Compress and minimize files.  
Add param **--prod** when execute task

> gulp stylus --land my-first-page **--prod**  
> gulp compress --land my-first-page **--prod**

`This param its only available for the tasks`**`stylus`**` and `**`compress`**
