const chalk = require("chalk");
const Client = require("./client");
const { localConfig, globalConfig } = require('./config');
const { projectsList } = require('./commands/projects');
const { organizationsList } = require('./commands/organizations');
const { teamsList } = require('./commands/teams');
const { functionsListRuntimes, functionsListSpecifications, functionsList } = require('./commands/functions');
const { accountListMfaFactors } = require("./commands/account");
const { sdkForConsole } = require("./sdks");
const { validateRequired } = require("./validations");
const { paginate } = require('./paginate');
const { isPortTaken } = require('./utils');
const { databasesList } = require('./commands/databases');
const { checkDeployConditions, isCloud } = require('./utils');
const JSONbig = require("json-bigint")({ storeAsString: false });
const { sitesListFrameworks, sitesListSpecifications, sitesList } = require('./commands/sites');

const whenOverride = (answers) => answers.override === undefined ? true : answers.override;

const getIgnores = (runtime) => {
    const languge = runtime.split("-").slice(0, -1).join("-");

    switch (languge) {
        case 'cpp':
            return ['build', 'CMakeFiles', 'CMakeCaches.txt'];
        case 'dart':
            return ['.packages', '.dart_tool'];
        case 'deno':
            return [];
        case 'dotnet':
            return ['bin', 'obj', '.nuget'];
        case 'java':
        case 'kotlin':
            return ['build'];
        case 'node':
        case 'bun':
            return ['node_modules', '.npm'];
        case 'php':
            return ['vendor'];
        case 'python':
        case 'python-ml':
            return ['__pypackages__'];
        case 'ruby':
            return ['vendor'];
        case 'rust':
            return ['target', 'debug', '*.rs.bk', '*.pdb'];
        case 'swift':
            return ['.build', '.swiftpm'];
    }

    return [];
};

const getEntrypoint = (runtime) => {
    const languge = runtime.split("-").slice(0, -1).join("-");

    switch (languge) {
        case 'dart':
            return 'lib/main.dart';
        case 'deno':
            return 'src/main.ts';
        case 'node':
            return 'src/main.js';
        case 'bun':
            return 'src/main.ts';
        case 'php':
            return 'src/index.php';
        case 'python':
        case 'python-ml':
            return 'src/main.py';
        case 'ruby':
            return 'lib/main.rb';
        case 'rust':
            return 'main.rs';
        case 'swift':
            return 'Sources/index.swift';
        case 'cpp':
            return 'src/main.cc';
        case 'dotnet':
            return 'src/Index.cs';
        case 'java':
            return 'src/Main.java';
        case 'kotlin':
            return 'src/Main.kt';
        case 'go':
            return 'main.go';
    }

    return undefined;
};

const getInstallCommand = (runtime) => {
    const languge = runtime.split("-").slice(0, -1).join("-");

    switch (languge) {
        case 'dart':
            return 'dart pub get';
        case 'deno':
            return "deno cache src/main.ts";
        case 'node':
            return 'npm install';
        case 'bun':
            return 'bun install';
        case 'php':
            return 'composer install';
        case 'python':
        case 'python-ml':
            return 'pip install -r requirements.txt';
        case 'ruby':
            return 'bundle install';
        case 'rust':
            return 'cargo install';
        case 'dotnet':
            return 'dotnet restore';
        case 'swift':
        case 'java':
        case 'kotlin':
        case 'cpp':
            return '';
    }

    return undefined;
};

const questionsInitProject = [
    {
        type: "confirm",
        name: "override",
        message:
            `An Appwrite project ( ${localConfig.getProject()['projectId']} ) is already associated with the current directory. Would you like to override`,
        when() {
            return Object.keys(localConfig.getProject()).length !== 0;
        }
    },
    {
        type: "list",
        name: "start",
        when: whenOverride,
        message: "How would you like to start?",
        choices: [
            {
                name: "Create new project",
                value: "new"
            },
            {
                name: "Link directory to an existing project",
                value: "existing"
            }
        ]
    },
    {
        type: "search-list",
        name: "organization",
        message: "Choose your organization",
        choices: async () => {
            let client = await sdkForConsole(true);
            const { teams } = isCloud()
                ? await paginate(organizationsList, { parseOutput: false, sdk: client }, 100, 'teams') 
                : await paginate(teamsList, { parseOutput: false, sdk: client }, 100, 'teams');

            let choices = teams.map((team, idx) => {
                return {
                    name: `${team.name} (${team['$id']})`,
                    value: team['$id']
                }
            })

            if (choices.length == 0) {
                throw new Error(`No organizations found. Please create a new organization at ${globalConfig.getEndpoint().replace('/v1', '/console/onboarding')}`)
            }

            return choices;
        },
        when: whenOverride
    },
    {
        type: "input",
        name: "project",
        message: "What would you like to name your project?",
        default: "My Awesome Project",
        when: (answer) => answer.start !== 'existing'
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your project?",
        default: "unique()",
        when: (answer) => answer.start !== 'existing'
    },
    {
        type: "search-list",
        name: "project",
        message: "Choose your Appwrite project.",
        choices: async (answers) => {
            const queries = [
                JSON.stringify({ method: 'equal', attribute: 'teamId', values: [answers.organization] }),
                JSON.stringify({ method: 'orderDesc', attribute: '$id' })
            ]

            const { projects } = await paginate(projectsList, { parseOutput: false }, 100, 'projects', queries);

            let choices = projects.map((project) => {
                return {
                    name: `${project.name} (${project['$id']})`,
                    value: {
                        "$id": project['$id'],
                        "region": project.region || ''
                    }
                }
            })

            if (choices.length === 0) {
                throw new Error("No projects found. Please create a new project.")
            }

            return choices;
        },
        when: (answer) => answer.start === 'existing'
    },
    {
        type: "list",
        name: "region",
        message: "Select your Appwrite Cloud region",
        choices: async () => {
            let client = await sdkForConsole(true);
            let response = await client.call("GET", "/console/regions");
            let regions = response.regions || [];
            if (!regions.length) {
                throw new Error("No regions found. Please check your network or Appwrite Cloud availability.");
            }
            return regions.filter(region => !region.disabled).map(region => ({
                name: `${region.name} (${region.$id})`,
                value: region.$id
            }));
        },
        when: (answer) => {
            if (answer.start === 'existing') return false;
            return isCloud();
        }
    }
];
const questionsInitProjectAutopull = [
    {
        type: "confirm",
        name: "autopull",
        message:
            `Would you like to pull all resources from project you just linked?`
    },
];
const questionsPullResources = [
    {
        type: "list",
        name: "resource",
        message: "Which resources would you like to pull?",
        choices: [
            { name: `Settings ${chalk.blackBright(`(Project)`)}`, value: 'settings' },
            { name: `Functions ${chalk.blackBright(`(Deployment)`)}`, value: 'functions' },
            { name: `Collections ${chalk.blackBright(`(Databases)`)}`, value: 'collections' },
            { name: `Buckets ${chalk.blackBright(`(Storage)`)}`, value: 'buckets' },
            { name: `Teams ${chalk.blackBright(`(Auth)`)}`, value: 'teams' },
            { name: `Topics ${chalk.blackBright(`(Messaging)`)}`, value: 'messages' }
        ]
    }
]

const questionsPullFunctions = [
    {
        type: "checkbox",
        name: "functions",
        message: "Which functions would you like to pull?",
        validate: (value) => validateRequired('function', value),
        choices: async () => {
            const { functions } = await paginate(functionsList, { parseOutput: false }, 100, 'functions');

            if (functions.length === 0) {
                throw "We couldn't find any functions in your Appwrite project";
            }
            return functions.map(func => {
                return {
                    name: `${func.name} (${func.$id})`,
                    value: { ...func }
                }
            });
        }
    }
];

const questionsPullFunctionsCode = [
    {
        type: "confirm",
        name: "override",
        message: "Do you want to pull source code of the latest deployment?"
    },
];

const questionsPullSites = [
    {
        type: "checkbox",
        name: "sites",
        message: "Which sites would you like to pull?",
        validate: (value) => validateRequired('site', value),
        choices: async () => {
            const { sites } = await paginate(sitesList, { parseOutput: false }, 100, 'sites');

            if (sites.length === 0) {
                throw "We couldn't find any sites in your Appwrite project";
            }
            return sites.map(site => {
                return {
                    name: `${site.name} (${site.$id})`,
                    value: { ...site }
                }
            });
        }
    }
];

const questionsPullSitesCode = [
    {
        type: "confirm",
        name: "override",
        message: "Do you want to pull source code of the latest deployment?"
    },
];

const questionsCreateFunction = [
    {
        type: "input",
        name: "name",
        message: "What would you like to name your function?",
        default: "My Awesome Function"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your function?",
        default: "unique()"
    },
    {
        type: "list",
        name: "runtime",
        message: "What runtime would you like to use?",
        choices: async () => {
            let response = await functionsListRuntimes({
                parseOutput: false
            })
            let runtimes = response["runtimes"]
            let choices = runtimes.map((runtime, idx) => {
                return {
                    name: `${runtime.name} (${runtime['$id']})`,
                    value: {
                        id: runtime['$id'],
                        name: runtime['$id'].split('-')[0],
                        entrypoint: getEntrypoint(runtime['$id']),
                        ignore: getIgnores(runtime['$id']),
                        commands: getInstallCommand(runtime['$id'])
                    },
                }
            })
            return choices;
        },
    },
    {
        type: "list",
        name: "specification",
        message: "What specification would you like to use?",
        choices: async () => {
            let response = await functionsListSpecifications({
                parseOutput: false
            })
            let specifications = response["specifications"]
            let choices = specifications.map((spec, idx) => {
                return {
                    name: `${spec.cpus} CPU, ${spec.memory}MB RAM`,
                    value: spec.slug,
                    disabled: spec.enabled === false ? 'Upgrade to use' : false
                }
            })
            return choices;
        },
    }
];

const questionsCreateFunctionSelectTemplate = (templates) => {
    return [
        {
            type: "search-list",
            name: "template",
            message: "What template would you like to use?",
            choices: templates.map((template) => {
                const name = `${template[0].toUpperCase()}${template.split('').slice(1).join('')}`.replace(/[-_]/g, ' ');

                return { value: template, name }
            })
        }
    ];
};



const questionsCreateBucket = [
    {
        type: "input",
        name: "bucket",
        message: "What would you like to name your bucket?",
        default: "My Awesome Bucket"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your bucket?",
        default: "unique()"
    },
    {
        type: "list",
        name: "fileSecurity",
        message: "Enable File-Security configuring permissions for individual file",
        choices: ["No", "Yes"]
    }
];

const questionsCreateTeam = [
    {
        type: "input",
        name: "bucket",
        message: "What would you like to name your team?",
        default: "My Awesome Team"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your team?",
        default: "unique()"
    }
];

const questionsCreateCollection = [
    {
        type: "list",
        name: "method",
        message: "What database would you like to use for your collection",
        choices: ["New", "Existing"],
        when: async () => {
            return localConfig.getDatabases().length !== 0;
        }
    },
    {
        type: "search-list",
        name: "database",
        message: "Choose the collection database",
        choices: async () => {
            const databases = localConfig.getDatabases();

            let choices = databases.map((database, idx) => {
                return {
                    name: `${database.name} (${database.$id})`,
                    value: database.$id
                }
            })

            if (choices.length === 0) {
                throw new Error("No databases found. Please create one in project console.")
            }

            return choices;
        },
        when: (answers) => (answers.method ?? '').toLowerCase() === 'existing'
    },
    {
        type: "input",
        name: "databaseName",
        message: "What would you like to name your database?",
        default: "My Awesome Database",
        when: (answers) => (answers.method ?? '').toLowerCase() !== 'existing'
    },
    {
        type: "input",
        name: "databaseId",
        message: "What ID would you like to have for your database?",
        default: "unique()",
        when: (answers) => (answers.method ?? '').toLowerCase() !== 'existing'
    },
    {
        type: "input",
        name: "collection",
        message: "What would you like to name your collection?",
        default: "My Awesome Collection"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your collection?",
        default: "unique()"
    },
    {
        type: "list",
        name: "documentSecurity",
        message: "Enable Document-Security for configuring permissions for individual documents",
        choices: ["No", "Yes"]
    }
];

const questionsCreateMessagingTopic = [
    {
        type: "input",
        name: "topic",
        message: "What would you like to name your messaging topic?",
        default: "My Awesome Topic"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your messaging topic?",
        default: "unique()"
    }
];

const questionsPullCollection = [
    {
        type: "checkbox",
        name: "databases",
        message: "From which database would you like to pull collections?",
        validate: (value) => validateRequired('collection', value),
        choices: async () => {
            let response = await databasesList({
                parseOutput: false
            })
            let databases = response["databases"]

            if (databases.length <= 0) {
                throw new Error("No databases found. Please create one in project console.")
            }
            let choices = databases.map((database, idx) => {
                return {
                    name: `${database.name} (${database.$id})`,
                    value: database.$id
                }
            })
            return choices;
        }
    }
];

const questionsLogin = [
    {
        type: "list",
        name: "method",
        message: "What you like to do?",
        choices: [
            { name: 'Login to an account', value: 'login' },
            { name: 'Switch to an account', value: 'select' }
        ],
        when: () => globalConfig.getSessions().length >= 2
    },
    {
        type: "input",
        name: "email",
        message: "Enter your email",
        validate(value) {
            if (!value) {
                return "Please enter your email";
            }
            return true;
        },
        when: (answers) => answers.method !== 'select'
    },
    {
        type: "password",
        name: "password",
        message: "Enter your password",
        mask: "*",
        validate(value) {
            if (!value) {
                return "Please enter your password";
            }
            return true;
        },
        when: (answers) => answers.method !== 'select'
    },
    {
        type: "search-list",
        name: "accountId",
        message: "Select an account to use",
        choices() {
            const sessions = globalConfig.getSessions();
            const current = globalConfig.getCurrentSession();

            const data = [];

            const longestEmail = sessions.reduce((prev, current) => (prev && (prev.email ?? '').length > (current.email ?? '').length) ? prev : current).email.length;

            sessions.forEach((session) => {
                if (session.email) {
                    data.push({
                        current: current === session.id,
                        value: session.id,
                        name: `${session.email.padEnd(longestEmail)} ${current === session.id ? chalk.green.bold('current') : ' '.repeat(6)} ${session.endpoint}`,
                    });
                }
            })

            return data.sort((a, b) => Number(b.current) - Number(a.current))
        },
        when: (answers) => answers.method === 'select'
    },
];
const questionGetEndpoint = [
    {
        type: "input",
        name: "endpoint",
        message: "Enter the endpoint of your Appwrite server",
        default: "http://localhost/v1",
        async validate(value) {
            if (!value) {
                return "Please enter a valid endpoint.";
            }
            let client = new Client().setEndpoint(value);
            try {
                let response = await client.call('get', '/health/version');
                if (response.version) {
                    return true;
                } else {
                    throw new Error();
                }
            } catch (error) {
                return "Invalid endpoint or your Appwrite server is not running as expected.";
            }
        }
    }
];

const questionsLogout = [
    {
        type: "checkbox",
        name: "accounts",
        message: "Select accounts to logout from",
        validate: (value) => validateRequired('account', value),
        choices() {
            const sessions = globalConfig.getSessions();
            const current = globalConfig.getCurrentSession();

            const data = [];

            const longestEmail = sessions.reduce((prev, current) => (prev && (prev.email ?? '').length > (current.email ?? '').length) ? prev : current).email.length;

            sessions.forEach((session) => {
                if (session.email) {
                    data.push({
                        current: current === session.id,
                        value: session.id,
                        name: `${session.email.padEnd(longestEmail)} ${current === session.id ? chalk.green.bold('current') : ' '.repeat(6)} ${session.endpoint}`,
                    });
                }
            })

            return data.sort((a, b) => Number(b.current) - Number(a.current))
        }
    }
];

const questionsPushResources = [
    {
        type: "list",
        name: "resource",
        message: "Which resources would you like to push?",
        choices: [
            { name: `Settings ${chalk.blackBright(`(Project)`)}`, value: 'settings' },
            { name: `Functions ${chalk.blackBright(`(Deployment)`)}`, value: 'functions' },
            { name: `Collections ${chalk.blackBright(`(Databases)`)}`, value: 'collections' },
            { name: `Buckets ${chalk.blackBright(`(Storage)`)}`, value: 'buckets' },
            { name: `Teams ${chalk.blackBright(`(Auth)`)}`, value: 'teams' },
            { name: `Topics ${chalk.blackBright(`(Messaging)`)}`, value: 'messages' }
        ]
    }
];

const questionsInitResources = [
    {
        type: "list",
        name: "resource",
        message: "Which resource would you create?",
        choices: [
            { name: 'Function', value: 'function' },
            { name: 'Site', value: 'site' },
            { name: 'Collection', value: 'collection' },
            { name: 'Bucket', value: 'bucket' },
            { name: 'Team', value: 'team' },
            { name: 'Topic', value: 'message' }
        ]
    }
];

const questionsPushSites = [
    {
        type: "checkbox",
        name: "sites",
        message: "Which sites would you like to push?",
        validate: (value) => validateRequired('site', value),
        when: () => localConfig.getSites().length > 0,
        choices: () => {
            let sites = localConfig.getSites();
            checkDeployConditions(localConfig)
            let choices = sites.map((site, idx) => {
                return {
                    name: `${site.name} (${site.$id})`,
                    value: site.$id
                }
            })
            return choices;
        }
    },
];

const questionsPushFunctions = [
    {
        type: "checkbox",
        name: "functions",
        message: "Which functions would you like to push?",
        validate: (value) => validateRequired('function', value),
        when: () => localConfig.getFunctions().length > 0,
        choices: () => {
            let functions = localConfig.getFunctions();
            checkDeployConditions(localConfig)
            let choices = functions.map((func, idx) => {
                return {
                    name: `${func.name} (${func.$id})`,
                    value: func.$id
                }
            })
            return choices;
        }
    },
]

const questionsPushCollections = [
    {
        type: "checkbox",
        name: "collections",
        message: "Which collections would you like to push?",
        validate: (value) => validateRequired('collection', value),
        when: () => localConfig.getCollections().length > 0,
        choices: () => {
            let collections = localConfig.getCollections();
            checkDeployConditions(localConfig)

            return collections.map(collection => {
                return {
                    name: `${collection.name} (${collection['databaseId']} - ${collection['$id']})`,
                    value: `${collection['databaseId']}|${collection['$id']}`
                }
            });
        }
    }
];

const questionPushChanges = [
    {
        type: "input",
        name: "changes",
        message: `Are you sure you want to apply these changes? (YES/NO)`
    }
];

const questionPushChangesConfirmation = [
    {
        type: "input",
        name: "changes",
        message: `Please type 'YES' or 'NO':`
    }
];

const questionsPushBuckets = [
    {
        type: "checkbox",
        name: "buckets",
        message: "Which buckets would you like to push?",
        validate: (value) => validateRequired('bucket', value),
        when: () => localConfig.getBuckets().length > 0,
        choices: () => {
            let buckets = localConfig.getBuckets();
            checkDeployConditions(localConfig)

            return buckets.map(bucket => {
                return {
                    name: `${bucket.name} (${bucket['$id']})`,
                    value: bucket.$id
                }
            });
        }
    }
]

const questionsPushMessagingTopics = [
    {
        type: "checkbox",
        name: "topics",
        message: "Which messaging topic would you like to push?",
        validate: (value) => validateRequired('topics', value),
        when: () => localConfig.getMessagingTopics().length > 0,
        choices: () => {
            let topics = localConfig.getMessagingTopics();

            return topics.map(topic => {
                return {
                    name: `${topic.name} (${topic['$id']})`,
                    value: topic.$id
                }
            });
        }
    }
]

const questionsGetEntrypoint = [
    {
        type: "input",
        name: "entrypoint",
        message: "Enter the entrypoint",
        default: null,
        validate(value) {
            if (!value) {
                return "Please enter your entrypoint";
            }
            return true;
        }
    },
]

const questionsPushTeams = [
    {
        type: "checkbox",
        name: "teams",
        message: "Which teams would you like to push?",
        validate: (value) => validateRequired('team', value),
        when: () => localConfig.getTeams().length > 0,
        choices: () => {
            let teams = localConfig.getTeams();
            checkDeployConditions(localConfig);

            return teams.map(team => {
                return {
                    name: `${team.name} (${team['$id']})`,
                    value: team.$id
                }
            });
        }
    },
];

const questionsListFactors = [
    {
        type: "list",
        name: "factor",
        message: "Your account is protected by multi-factor authentication. Please choose one for verification.",
        choices: async () => {
            let client = await sdkForConsole(false);
            const factors = await accountListMfaFactors({
                sdk: client,
                parseOutput: false
            });

            const choices = [
                {
                    name: `Authenticator app (Get a code from a third-party authenticator app)`,
                    value: 'totp'
                },
                {
                    name: `Email (Get a security code at your Appwrite email address)`,
                    value: 'email'
                },
                {
                    name: `SMS (Get a security code on your Appwrite phone number)`,
                    value: 'phone'
                },
                {
                    name: `Recovery code (Use one of your recovery codes for verification)`,
                    value: 'recoveryCode'
                }
            ].filter((ch) => factors[ch.value] === true);

            return choices;
        }
    }
];

const questionsMfaChallenge = [
    {
        type: "input",
        name: "otp",
        message: "Enter OTP",
        validate(value) {
            if (!value) {
                return "Please enter OTP";
            }
            return true;
        },
    }
];

const questionsRunFunctions = [
    {
        type: "list",
        name: "function",
        message: "Which function would you like to develop locally?",
        validate: (value) => validateRequired('function', value),
        choices: () => {
            let functions = localConfig.getFunctions();
            if (functions.length === 0) {
                throw new Error("No functions found. Use 'appwrite pull functions' to synchronize existing one, or use 'appwrite init function' to create a new one.");
            }
            let choices = functions.map((func, idx) => {
                return {
                    name: `${func.name} (${func.$id})`,
                    value: func.$id
                }
            })
            return choices;
        }
    }
];

const questionsCreateSite = [
    {
        type: "input",
        name: "name",
        message: "What would you like to name your site?",
        default: "My Awesome Site"
    },
    {
        type: "input",
        name: "id",
        message: "What ID would you like to have for your site?",
        default: "unique()"
    },
    {
        type: "list",
        name: "framework",
        message: "What framework would you like to use?",
        choices: async () => {
            let response = await sitesListFrameworks({
                parseOutput: false
            });
            let frameworks = response["frameworks"];
            let choices = frameworks.map((framework) => {
                return {
                    name: `${framework.name} (${framework.key})`,
                    value: framework,
                }
            });
            return choices;
        },
    },
    {
        type: "list",
        name: "specification",
        message: "What specification would you like to use?",
        choices: async () => {
            let response = await sitesListSpecifications({
                parseOutput: false
            });
            let specifications = response["specifications"];
            let choices = specifications.map((spec) => {
                return {
                    name: `${spec.cpus} CPU, ${spec.memory}MB RAM`,
                    value: spec.slug,
                    disabled: spec.enabled === false ? 'Upgrade to use' : false
                }
            });
            return choices;
        },
    }
];

module.exports = {
    questionsInitProject,
    questionsInitProjectAutopull,
    questionsCreateFunction,
    questionsCreateFunctionSelectTemplate,
    questionsCreateBucket,
    questionsCreateCollection,
    questionsCreateMessagingTopic,
    questionsPullFunctions,
    questionsPullFunctionsCode,
    questionsPullSites,
    questionsPullSitesCode,
    questionsLogin,
    questionsPullResources,
    questionsLogout,
    questionsPullCollection,
    questionsPushResources,
    questionsPushFunctions,
    questionsPushSites,
    questionsPushCollections,
    questionsPushBuckets,
    questionsPushMessagingTopics,
    questionsPushTeams,
    questionsGetEntrypoint,
    questionsListFactors,
    questionsMfaChallenge,
    questionsRunFunctions,
    questionGetEndpoint,
    questionsInitResources,
    questionsCreateTeam,
    questionPushChanges,
    questionPushChangesConfirmation,
    questionsCreateSite
};
