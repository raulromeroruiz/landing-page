let workflow = {
    templates: './templates/',
    landings: '../landings/',
    capitalize: function(_params) {
        words = _params.str.split("-");
        for(x in words) {
            words[x] = words[x].charAt(0).toUpperCase() + words[x].slice(1);
        }
        return words.join(' ');
    }
};

module.exports = workflow;