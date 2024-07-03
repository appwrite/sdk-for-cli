const Tail = require('tail').Tail;
const EventEmitter = require('node:events');
const ignore = require("ignore");
const tar = require("tar");
const fs = require("fs");
const ID = require("../id");
const childProcess = require('child_process');
const chokidar = require('chokidar');
const inquirer = require("inquirer");
const path = require("path");
const { Command } = require("commander");
const { localConfig, globalConfig } = require("../config");
const { paginate } = require('../paginate');
const { functionsListVariables } = require('./functions');
const { usersGet, usersCreateJWT } = require('./users');
const { projectsCreateJWT } = require('./projects');
const { questionsRunFunctions } = require("../questions");
const { actionRunner, success, log, error, commandDescriptions, drawTable } = require("../parser");
const { systemHasCommand, isPortTaken, getAllFiles } = require('../utils');
const { openRuntimesVersion, runtimeNames, systemTools, JwtManager, Queue } = require('../emulation/utils');
const { dockerStop, dockerCleanup, dockerStart, dockerBuild, dockerPull, dockerStopActive } = require('../emulation/docker');

const runFunction = async ({ port, functionId, noVariables, noReload, userId } = {}) => {
    // Selection
    if(!functionId) {
        const answers = await inquirer.prompt(questionsRunFunctions[0]);
        functionId = answers.function;
    }

    const functions = localConfig.getFunctions();
    const func = functions.find((f) => f.$id === functionId);
    if (!func) {
        throw new Error("Function '" + functionId + "' not found.")
    }

    const runtimeName = func.runtime.split("-").slice(0, -1).join("-");
    const tool = systemTools[runtimeName];

    // Configuration: Port
    if(port) {
        port = +port;
    }

    if(isNaN(port)) {
        port = null;
    }

    if(port) {
        const taken = await isPortTaken(port);

        if(taken) {
            error(`Port ${port} is already in use by another process.`);
            return;
        }
    }

    if(!port) {
        let portFound = false;
        port = 3000;
        while(port < 3100) {
            const taken = await isPortTaken(port);
            if(!taken) {
                portFound = true;
                break;
            }

            port++;
        }

        if(!portFound) {
            error('Could not find an available port. Please select a port with `appwrite run --port YOUR_PORT` command.');
            return;
        }
    }

    // Configuration: Engine
    if(!systemHasCommand('docker')) {
        return error("Docker Engine is required for local development. Please install Docker using: https://docs.docker.com/engine/install/");
    }

    // Settings
    const settings = {
        runtime: func.runtime,
        entrypoint: func.entrypoint,
        path: func.path,
        commands: func.commands,
    };

    log("Local function configuration:");
    drawTable([settings]);
    log('If you wish to change your local settings, update the appwrite.json file and rerun the `appwrite run` command.');

    await dockerCleanup();

    process.on('SIGINT', async () => {
        log('Cleaning up ...');
        await dockerCleanup();
        success();
        process.exit();
    });

    const logsPath = path.join(process.cwd(), func.path, '.appwrite/logs.txt');
    const errorsPath = path.join(process.cwd(), func.path, '.appwrite/errors.txt');

    if(!fs.existsSync(path.dirname(logsPath))) {
        fs.mkdirSync(path.dirname(logsPath), { recursive: true });
    }

    if (!fs.existsSync(logsPath)) {
        fs.writeFileSync(logsPath, '');
    }

    if (!fs.existsSync(errorsPath)) {
        fs.writeFileSync(errorsPath, '');
    }

    const variables = {};
    if(!noVariables) {
        if (globalConfig.getEndpoint() === '' || globalConfig.getCookie() === '') {
            error("No user is signed in. To sign in, run: appwrite login. Function will run locally, but will not have your function's environment variables set.");
        } else {
            try {
                const { variables: remoteVariables } = await paginate(functionsListVariables, {
                    functionId: func['$id'],
                    parseOutput: false
                }, 100, 'variables');

                remoteVariables.forEach((v) => {
                    variables[v.key] = v.value;
                });
            } catch(err) {
                log("Could not fetch remote variables: " + err.message);
                log("Function will run locally, but will not have your function's environment variables set.");
            }
        }
    }

    variables['APPWRITE_FUNCTION_API_ENDPOINT'] = globalConfig.getFrom('endpoint');
    variables['APPWRITE_FUNCTION_ID'] = func.$id;
    variables['APPWRITE_FUNCTION_NAME'] = func.name;
    variables['APPWRITE_FUNCTION_DEPLOYMENT'] = ''; // TODO: Implement when relevant
    variables['APPWRITE_FUNCTION_PROJECT_ID'] = localConfig.getProject().projectId;
    variables['APPWRITE_FUNCTION_RUNTIME_NAME'] = runtimeNames[runtimeName] ?? '';
    variables['APPWRITE_FUNCTION_RUNTIME_VERSION'] = func.runtime;

    await JwtManager.setup(userId);

    const headers = {};
    headers['x-appwrite-key'] = JwtManager.functionJwt ?? '';
    headers['x-appwrite-trigger'] = 'http';
    headers['x-appwrite-event'] = '';
    headers['x-appwrite-user-id'] = userId ?? '';
    headers['x-appwrite-user-jwt'] = JwtManager.userJwt ?? '';
    variables['OPEN_RUNTIMES_HEADERS'] = JSON.stringify(headers);

    await dockerPull(func);
    await dockerBuild(func, variables);
    await dockerStart(func, variables, port);

    new Tail(logsPath).on("line", function(data) {
        console.log(data);
    });
    new Tail(errorsPath).on("line", function(data) {
        console.log(data);
    });

    if(!noReload) {
        chokidar.watch('.', {
            cwd: path.join(process.cwd(), func.path),
            ignoreInitial: true,
            ignored: [ ...(func.ignore ?? []), 'code.tar.gz', '.appwrite', '.appwrite/', '.appwrite/*', '.appwrite/**', '.appwrite/*.*', '.appwrite/**/*.*' ]
        }).on('all', async (_event, filePath) => {
            Queue.push(filePath);
        });
    }

    Queue.events.on('reload', async ({ files }) => {
        Queue.lock();

        log('Live-reloading due to file changes: ');
        for(const file of files) {
            log(`- ${file}`);
        }

        try {
            log('Stopping the function ...');

            await dockerStopActive();

            const dependencyFile = files.find((filePath) => tool.dependencyFiles.includes(filePath));
            if(tool.isCompiled || dependencyFile) {
                log(`Rebuilding the function due to cange in ${dependencyFile} ...`);
                await dockerBuild(func, variables);
                await dockerStart(func, variables, port);
            } else {
                log('Hot-swapping function files ...');

                const functionPath = path.join(process.cwd(), func.path);
                const hotSwapPath = path.join(functionPath, '.appwrite/hot-swap');
                const buildPath = path.join(functionPath, '.appwrite/build.tar.gz');

                // Prepare temp folder
                if (!fs.existsSync(hotSwapPath)) {
                    fs.mkdirSync(hotSwapPath, { recursive: true });
                } else {
                    fs.rmSync(hotSwapPath, { recursive: true, force: true });
                    fs.mkdirSync(hotSwapPath, { recursive: true });
                }

                await tar
                    .extract({
                        gzip: true,
                        sync: true,
                        cwd: hotSwapPath,
                        file: buildPath
                    });

                const ignorer = ignore();
                ignorer.add('.appwrite');
                if (func.ignore) {
                    ignorer.add(func.ignore);
                }

                const filesToCopy = getAllFiles(functionPath).map((file) => path.relative(functionPath, file)).filter((file) => !ignorer.ignores(file));
                for(const f of filesToCopy) {
                    const filePath = path.join(hotSwapPath, f);
                    if (fs.existsSync(filePath)) {
                        fs.rmSync(filePath, { force: true });
                    }

                    const fileDir = path.dirname(filePath);
                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true });
                    }

                    const sourcePath = path.join(functionPath, f);
                    fs.copyFileSync(sourcePath, filePath);
                }

                await tar
                    .create({
                        gzip: true,
                        sync: true,
                        cwd: hotSwapPath,
                        file: buildPath
                    }, ['.']);

                fs.rmSync(hotSwapPath, { recursive: true, force: true });

                await dockerStart(func, variables, port);
            }
        } catch(err) {
            console.error(err);
        } finally {
            Queue.unlock();
        }
    });
}

const run = new Command("run")
    .description(commandDescriptions['run'])
    .configureHelp({
        helpWidth: process.stdout.columns || 80
    })
    .action(actionRunner(async (_options, command) => {
        command.help();
    }));

run
    .command("function")
    .alias("functions")
    .description("Run functions in the current directory.")
    .option(`--functionId <functionId>`, `Function ID`)
    .option(`--port <port>`, `Local port`)
    .option(`--userId <userId>`, `ID of user to impersonate`)
    .option(`--noVariables`, `Prevent pulling variables from function settings`)
    .option(`--noReload`, `Prevent live reloading of server when changes are made to function files`)
    .action(actionRunner(runFunction));

module.exports = {
    run
}
