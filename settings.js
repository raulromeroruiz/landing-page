let workflow = {
    master: './master/',
    templates: './templates/',
    landings: '../landings/',
    pageTitle: function(landing) {
        words = landing.split("-");
        let newWords = words.map(function(word){
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        return newWords.join(' ');
    }
};

module.exports = workflow;