const args = require('yargs').argv;

let workflow = {
    master: './master/',
    templates: './templates/',
    landings: '../landings/',
    landingName: args.land,
    isProd: args.prod ?? false,
    paths() {
        return {
            template : this.templates + this.landingName,
            landing  : this.landings + this.landingName
        };
    },
    pageTitle() {
        if (!this.landingName)
            return "";
        return this.landingName.split("-").map(function(word, index){
            return word.charAt(0).toUpperCase() + word.slice(1)
        }).join(" ");
    }
};
workflow.paths = workflow.paths();
workflow.landingTitle = workflow.pageTitle();

module.exports = workflow;