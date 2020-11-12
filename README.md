# Work Flow Landing Page
This flow create a landing page using nodejs and gulp more simple and fast. This process automatize tasks to create files html (from pug), css files (from stylus) and optimize js files.  
This layout use Bootstrap v4 how grid base.

## Requirements
- Node.js
- Gulp Cli 3.9.1
- Browser Sync


## Install Repo
Clone repository  
> git clone git@github.com:raulromeroruiz/landing-page.git  

Into folder workflow, run command  
> npm install


## Template Directory

From master folder, copy landing dir into folder templates, after rename to TEMPLATE_DIR.  
Detail **landing directory**

```
workflow
	├── master
	|	└── landing
	└── templates
		└── TEMPLATE_DIR
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

> gulp start --land ``<TEMPLATE_DIR>``

- Param ``--land`` is name folder template-dir where save files and assets landing


### Root Path Files
When run gulp start..., show three options: Path, Page and Prod.
```javascript
[11:43:27] Starting 'start'...
[11:43:27] Starting 'default'...
...
...
Path -->  ../landings
Page -->  TEMPLATE_DIR
Prod -->  false
[11:43:36] Finished 'default' after 8.51 s
[11:43:36] Finished 'start' after 8.51 s
```

This workflow generate folder *template-dir*  
Up two levels. Check path: **landings\TEMPLATE_DIR**  

```
	├──landings
	|	└── TEMPLATE_DIR
	|		└── index.html
	└── workflow
		└── templates
			├── <b>TEMPLATE_DIR</b>
			|	└── index.pug
			├── .gitignore
			├── gulpfile.js
			├── package.json
			└── README.md
```

Launch the browser with URL: http://localhost:3000/TEMPLATE_DIR  
If not show files, change and save some pug files.  
Do the same for others files.


## Execute tasks independently

_**Pug**_
> gulp task --pug ``<TEMPLATE_DIR>``

_**Stylus**_
> gulp task --stylus ``<TEMPLATE_DIR>``

_**Compress**_
> gulp task --compress ``<TEMPLATE_DIR>``



## Production Mode

Compress and minimize files.  
Add param **--prod** when execute task

> gulp task --stylus TEMPLATE_DIR **--prod**  
> gulp task --compress TEMPLATE_DIR **--prod**

`This param only its available for tasks`**`stylus`**` and `**`compress`**
