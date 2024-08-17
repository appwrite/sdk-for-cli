const chalk = require('chalk');
const commander = require('commander');
const Table = require('cli-table3');
const { description } = require('../package.json');
const { globalConfig } = require("./config.js");
const os = require('os');
const Client = require("./client");

const cliConfig = {
    verbose: false,
    json: false,
    force: false,
    all: false,
    ids: [],
    report: false,
    reportData: {}
};

const parse = (data) => {
    if (cliConfig.json) {
        drawJSON(data);
        return;
    }

    for (let key in data) {
        if (Array.isArray(data[key])) {
            console.log(`${chalk.yellow.bold.underline(key)}`);
            if (typeof data[key][0] === 'object') {
                drawTable(data[key]);
            } else {
                drawJSON(data[key]);
            }
        } else if (typeof data[key] === 'object') {
            if (data[key]?.constructor?.name === 'BigNumber') {
                console.log(`${chalk.yellow.bold(key)} : ${data[key]}`);
            } else {
                console.log(`${chalk.yellow.bold.underline(key)}`)
                drawTable([data[key]]);
            }
        } else {
            console.log(`${chalk.yellow.bold(key)} : ${data[key]}`);
        }
    }
}

const drawTable = (data) => {
    if (data.length == 0) {
        console.log("[]")
        return;
    }

    // Create an object with all the keys in it
    let obj = data.reduce((res, item) => ({ ...res, ...item }));
    // Get those keys as an array
    let keys = Object.keys(obj);
    // Create an object with all keys set to the default value ''
    let def = keys.reduce((result, key) => {
        result[key] = '-'
        return result;
    }, {});
    // Use object destrucuring to replace all default values with the ones we have
    data = data.map((item) => ({ ...def, ...item }));

    let columns = Object.keys(data[0]);

    let table = new Table({
        head: columns.map(c => chalk.cyan.italic.bold(c)),
        chars: {
            'top': ' ',
            'top-mid': ' ',
            'top-left': ' ',
            'top-right': ' ',
            'bottom': ' ',
            'bottom-mid': ' ',
            'bottom-left': ' ',
            'bottom-right': ' ',
            'left': ' ',
            'left-mid': ' ',
            'mid': chalk.cyan('─'),
            'mid-mid': chalk.cyan('┼'),
            'right': ' ',
            'right-mid': ' ',
            'middle': chalk.cyan('│')
        }
    });

    data.forEach(row => {
        let rowValues = [];
        for (let key in row) {
            if (row[key] === null) {
                rowValues.push("-");
            } else if (Array.isArray(row[key])) {
                rowValues.push(JSON.stringify(row[key]));
            } else if (typeof row[key] === 'object') {
                rowValues.push(JSON.stringify(row[key]));
            } else {
                rowValues.push(row[key]);
            }
        }
        table.push(rowValues);
    });
    console.log(table.toString());
}

const drawJSON = (data) => {
    console.log(JSON.stringify(data, null, 2));
}

const parseError = (err) => {
    if (cliConfig.report) {
        (async () => {
            let appwriteVersion = 'unknown';
            const endpoint = globalConfig.getEndpoint();
            const isCloud = endpoint.includes('cloud.appwrite.io') ? 'Yes' : 'No';

            try {
                const client = new Client().setEndpoint(endpoint);
                const res = await client.call('get', '/health/version');
                appwriteVersion = res.version;
            } catch {
            }

            const version = '6.0.0-rc.8';
            const stepsToReproduce = `Running \`appwrite ${cliConfig.reportData.data.args.join(' ')}\``;
            const yourEnvironment = `CLI version: ${version}\nOperation System: ${os.type()}\nAppwrite version: ${appwriteVersion}\nIs Cloud: ${isCloud}`;

            const stack = '```\n' + err.stack + '\n```';

            const githubIssueUrl = new URL('https://github.com/appwrite/appwrite/issues/new');
            githubIssueUrl.searchParams.append('labels', 'bug');
            githubIssueUrl.searchParams.append('template', 'bug.yaml');
            githubIssueUrl.searchParams.append('title', `🐛 Bug Report: ${err.message}`);
            githubIssueUrl.searchParams.append('actual-behavior', `CLI Error:\n${stack}`);
            githubIssueUrl.searchParams.append('steps-to-reproduce', stepsToReproduce);
            githubIssueUrl.searchParams.append('environment', yourEnvironment);

            log(`To report this error you can:\n - Create a support ticket in our Discord server https://appwrite.io/discord \n - Create an issue in our Github\n   ${githubIssueUrl.href}\n`);


            error('\n Stack Trace: \n');
            console.error(err);
            process.exit(1);
        })()
    } else {
        if (cliConfig.verbose) {
            console.error(err);
        } else {
            log('For detailed error pass the --verbose or --report flag');
            error(err.message);
        }
        process.exit(1);
    }

}

const actionRunner = (fn) => {
    return (...args) => {
        if (cliConfig.all && (Array.isArray(cliConfig.ids) && cliConfig.ids.length !== 0)) {
            error(`The '--all' and '--id' flags cannot be used together.`);
            process.exit(1);
        }
        return fn(...args).catch(parseError)
    };
}

const parseInteger = (value) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new commander.InvalidArgumentError('Not a number.');
    }
    return parsedValue;
}

const parseBool = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new commander.InvalidArgumentError('Not a boolean.');
}

const log = (message) => {
    console.log(`${chalk.cyan.bold("ℹ Info:")} ${chalk.cyan(message ?? "")}`);
}

const warn = (message) => {
    console.log(`${chalk.yellow.bold("ℹ Warning:")} ${chalk.yellow(message ?? "")}`);
}

const hint = (message) => {
    console.log(`${chalk.cyan.bold("♥ Hint:")} ${chalk.cyan(message ?? "")}`);
}

const success = (message) => {
    console.log(`${chalk.green.bold("✓ Success:")} ${chalk.green(message ?? "")}`);
}

const error = (message) => {
    console.error(`${chalk.red.bold("✗ Error:")} ${chalk.red(message ?? "")}`);
}

const logo = "\n    _                            _ _           ___   __   _____\n   \/_\\  _ __  _ ____      ___ __(_) |_ ___    \/ __\\ \/ \/   \\_   \\\n  \/\/_\\\\| '_ \\| '_ \\ \\ \/\\ \/ \/ '__| | __\/ _ \\  \/ \/   \/ \/     \/ \/\\\/\n \/  _  \\ |_) | |_) \\ V  V \/| |  | | ||  __\/ \/ \/___\/ \/___\/\\\/ \/_\n \\_\/ \\_\/ .__\/| .__\/ \\_\/\\_\/ |_|  |_|\\__\\___| \\____\/\\____\/\\____\/\n       |_|   |_|\n\n";

const commandDescriptions = {
    "account": `The account command allows you to authenticate and manage a user account.`,
    "graphql": `The graphql command allows you to query and mutate any resource type on your Appwrite server.`,
    "avatars": `The avatars command aims to help you complete everyday tasks related to your app image, icons, and avatars.`,
    "databases": `The databases command allows you to create structured collections of documents and query and filter lists of documents.`,
    "init": `The init command provides a convenient wrapper for creating and initializing projects, functions, collections, buckets, teams, and messaging-topics in  Appwrite.`,
    "push": `The push command provides a convenient wrapper for pushing your functions, collections, buckets, teams, and messaging-topics.`,
    "run": `The run command allows you to run the project locally to allow easy development and quick debugging.`,
    "functions": `The functions command allows you to view, create, and manage your Cloud Functions.`,
    "health": `The health command allows you to both validate and monitor your Appwrite server's health.`,
    "pull": `The pull command helps you pull your Appwrite project, functions, collections, buckets, teams, and messaging-topics`,
    "locale": `The locale command allows you to customize your app based on your users' location.`,
    "storage": `The storage command allows you to manage your project files.`,
    "teams": `The teams command allows you to group users of your project to enable them to share read and write access to your project resources.`,
    "users": `The users command allows you to manage your project users.`,
    "client": `The client command allows you to configure your CLI`,
    "login": `The login command allows you to authenticate and manage a user account.`,
    "logout": `The logout command allows you to log out of your Appwrite account.`,
    "whoami": `The whomai command gives information about the currently logged-in user.`,
    "register": `Outputs the link to create an Appwrite account.`,
    "console" : `The console command gives you access to the APIs used by the Appwrite Console.`,
    "assistant": `The assistant command allows you to interact with the Appwrite Assistant AI`,
    "messaging": `The messaging command allows you to manage topics and targets and send messages.`,
    "migrations": `The migrations command allows you to migrate data between services.`,
    "vcs": `The vcs command allows you to interact with VCS providers and manage your code repositories.`,
    "main": chalk.redBright(`${logo}${description}`),
}

module.exports = {
    drawTable,
    parse,
    actionRunner,
    parseInteger,
    parseBool,
    log,
    warn,
    hint,
    success,
    error,
    commandDescriptions,
    cliConfig,
    drawTable
}
