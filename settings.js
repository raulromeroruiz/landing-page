const args = require('yargs').argv;

let workflow = {
    master: './master/',
    templates: './templates/',
    landings: '../landings/',
    PAGE: args.land,
    isProd: args.prod,
    compressCSS: (args.prod) ? true:false,
    compressJS: (args.prod) ? true:false,
    beautifyJS: (args.prod) ? false:true,
    paths() {
        let paths = {
            templates : this.templates + this.PAGE,
            landings  : this.landings + this.PAGE
        };
        return paths;
    },
    pageTitle() {
        let words = this.PAGE.split("-");
        let newWords = words.map(function(word){
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        return newWords.join(' ');
    }
};
workflow.paths = workflow.paths();
workflow.landingTitle = workflow.pageTitle();

module.exports = workflow;