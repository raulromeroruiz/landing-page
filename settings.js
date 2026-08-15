const parseArgs = (argv) => {
    const args = {};

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (!arg.startsWith("--")) continue;

        const [rawKey, rawValue] = arg.slice(2).split("=");
        const nextValue = argv[i + 1];

        if (rawValue !== undefined) {
            args[rawKey] = rawValue;
        } else if (nextValue && !nextValue.startsWith("--")) {
            args[rawKey] = nextValue;
            i++;
        } else {
            args[rawKey] = true;
        }
    }

    return args;
};

const args = parseArgs(process.argv.slice(2));

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
        if (!this.landingName) return "";
        return this.landingName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
};
workflow.paths = workflow.paths();
workflow.landingTitle = workflow.pageTitle();

module.exports = workflow;
