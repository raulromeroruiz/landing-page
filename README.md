# Work Flow Landing Page
This flow create a landing page more simple and fast, using nodejs and gulp. This process automatize tasks to generate html files (from pug), css files (from stylus) and optimize js files (from uglify).  
The layout use Bootstrap v4 how grid base.

## Requirements
- Node.js
- Gulp Cli 3.9.1
- Browser Sync


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
Main template Pug file from landing page.

_**includes**_
Pug files, for header and footer sections. Mixins, functions and vars for pug files.

_**styles**_
Files for stylus pre-proccesor (_*.styl_)

_**scripts**_
Javascript files. Functions & events for page.

_**libs**_
Javascript files librarys (jQuery, plugins, etc)

_**sprites**_
Image sprite files. (Not available)

## Tasks
### default
Process all task and run local server.  
Also run watch task for listen change files (pug, js, styl), and execute the corresponding task.

### pug
Process all files *.pug* to *.html*

### stylus
All files are imported to styles.styl:
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
Finally process file styles.styl to styles.css

### compress
Process all **js** files.  
Combine, optimize and compress js source (folders libs & scripts) into javascript unique file


## Run workflow
We have **my-first-page** folder into templates, so run:

> gulp start --land ``my-first-page``

- For param ``--land`` set name folder (remember this example is my-first-page) where save files and assets


### Root Path Files
When run gulp start..., show three options: Path, Page and Prod.
```javascript
[11:43:27] Starting 'start'...
[11:43:27] Starting 'default'...
...
...
Path -->  ../landings
Page -->  my-first-page
Prod -->  false
[11:43:36] Finished 'default' after 8.51 s
[11:43:36] Finished 'start' after 8.51 s
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
If not show files, change and save some pug files.  
Do the same for others files.


## Execute tasks independently

_**Pug**_
> gulp task --pug ``my-first-page``

_**Stylus**_
> gulp task --stylus ``my-first-page``

_**Compress**_
> gulp task --compress ``my-first-page``



## Production Mode

Compress and minimize files.  
Add param **--prod** when execute task

> gulp task --stylus my-first-page **--prod**  
> gulp task --compress my-first-page **--prod**

`This param only its available for tasks`**`stylus`**` and `**`compress`**
