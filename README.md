# Work Flow Landing Page
This flow create a landing page using nodejs and gulp more simple and fast. This process automatize tasks to create files html (from pug), css files (from stylus) and optimize js files.  
This layout use Bootstrap v4 how grid base.

## Requirements
- Node.js
- Gulp Cli 3.9.1
- Browser Sync

## Install dependecies

> npm install


## Template Directory

From master folder, copy landing dir into folder templates, after rename.  
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
Image sprite files.

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


## Run gulp

> gulp default --land ``<TEMPLATE_DIR>`` --path ``<WEEK_NUMBER>``

- Param ``--land`` is name folder where save files and assets landing
- Param ``--path`` is number week folder where save folder landing page
- ``--path <WEEK_NUMBER>`` is optional in the current week
- The __TEMPLATE_DIR__ and __WEEK_NUMBER__ args, can set in anything order


### Root Path Files
When run gulp default..., show three options: Path, Page and Prod.
```javascript
[11:43:27] Starting 'default'...
Path -->  ../2019/50/
Page -->  kids-junior
Prod -->  false
[11:43:36] Finished 'default' after 8.51 s
```
The landing is created and saved by year and week.  
This workflow generate two foldes *year* and *number week* (Path option).  
Up two levels. Check path: **CURRENT_YEAR\CURRENT_WEEK\TEMPLATE_DIR**
<pre>
├── <b>CURRENT_YEAR</b>
|	└── <b>CURRENT_WEEK</b>
|		└── <b>TEMPLATE_DIR</b>
|			└── index.html
└── workflow
	└── templates
		├── <b>TEMPLATE_DIR</b>
		|	└── index.pug
		├── .gitignore
		├── gulpfile.js
		├── package.json
		└── README.md
</pre>
If not show files, change and save some pug files.  
Do the same for others files.

The _getWeekNumber_ function, get values CURRENT_YEAR and CURRENT_WEEK. (File gulpfile.js line 178)
```javascript
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
```

## Execute tasks independently

_**Pug**_
> gulp pug --land ``<TEMPLATE_DIR>`` --path ``<WEEK_NUMBER>``

_**Compress**_
> gulp compress --land ``<TEMPLATE_DIR>`` --path ``<WEEK_NUMBER>``

_**Stylus**_
> gulp stylus --land ``<TEMPLATE_DIR>`` --path ``<WEEK_NUMBER>``


## Production Mode

Compress and minimize files.  
Add param **--prod** when execute task

> gulp stylus --land TEMPLATE_DIR --path WEEK_NUMBER **--prod**

`This param only its available for tasks`**`stylus`**` and `**`compress`**
