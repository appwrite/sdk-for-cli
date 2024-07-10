const chalk = require('chalk');
const childProcess = require('child_process');
const { localConfig } = require("../config");
const path = require('path');
const fs = require('fs');
const { log, success, hint } = require("../parser");
const { openRuntimesVersion, systemTools, Queue } = require("./utils");

async function dockerStop(id) {
    const stopProcess = childProcess.spawn('docker', ['rm', '--force', id], {
        stdio: 'pipe',
        env: {
            ...process.env,
            DOCKER_CLI_HINTS: 'false'
        }
    });

    await new Promise((res) => { stopProcess.on('close', res) });
}

async function dockerPull(func) {
    const runtimeChunks = func.runtime.split("-");
    const runtimeVersion = runtimeChunks.pop();
    const runtimeName = runtimeChunks.join("-");
    const imageName = `openruntimes/${runtimeName}:${openRuntimesVersion}-${runtimeVersion}`;

    log('Verifying Docker image ...');

    const pullProcess = childProcess.spawn('docker', ['pull', imageName], {
        stdio: 'pipe',
        env: {
            ...process.env,
            DOCKER_CLI_HINTS: 'false'
        }
    });

    await new Promise((res) => { pullProcess.on('close', res) });
}

async function dockerBuild(func, variables) {
    const runtimeChunks = func.runtime.split("-");
    const runtimeVersion = runtimeChunks.pop();
    const runtimeName = runtimeChunks.join("-");
    const imageName = `openruntimes/${runtimeName}:${openRuntimesVersion}-${runtimeVersion}`;

    const functionDir = path.join(process.cwd(), func.path);

    const id = func.$id;

    const params = [ 'run' ];
    params.push('--name', id);
    params.push('-v', `${functionDir}/:/mnt/code:rw`);
    params.push('-e', 'APPWRITE_ENV=development');
    params.push('-e', 'OPEN_RUNTIMES_ENV=development');
    params.push('-e', 'OPEN_RUNTIMES_SECRET=');
    params.push('-e', `OPEN_RUNTIMES_ENTRYPOINT=${func.entrypoint}`);

    for(const k of Object.keys(variables)) {
        params.push('-e', `${k}=${variables[k]}`);
    }

    params.push(imageName, 'sh', '-c', `helpers/build.sh "${func.commands}"`);

    const buildProcess = childProcess.spawn('docker', params, {
        stdio: 'pipe',
        pwd: functionDir,
        env: {
            ...process.env,
            DOCKER_CLI_HINTS: 'false'
        }
    });

    buildProcess.stdout.on('data', (data) => {
        process.stdout.write(chalk.blackBright(`${data}\n`));
    });

    buildProcess.stderr.on('data', (data) => {
        process.stderr.write(chalk.blackBright(`${data}\n`));
    });

    const killInterval = setInterval(() => {
        if(!Queue.isEmpty()) {
            log('Cancelling build ...');
            buildProcess.stdout.destroy();
            buildProcess.stdin.destroy();
            buildProcess.stderr.destroy();
            buildProcess.kill("SIGKILL");
            clearInterval(killInterval);
        }
    }, 100);

    await new Promise((res) => { buildProcess.on('close', res) });

    clearInterval(interval);

    if(!Queue.isEmpty()) {
        return;
    }
    
    const copyPath = path.join(process.cwd(), func.path, '.appwrite', 'build.tar.gz');
    const copyDir = path.dirname(copyPath);
    if (!fs.existsSync(copyDir)) {
        fs.mkdirSync(copyDir, { recursive: true });
    }

    const copyProcess = childProcess.spawn('docker', ['cp', `${id}:/mnt/code/code.tar.gz`, copyPath], {
        stdio: 'pipe',
        pwd: functionDir,
        env: {
            ...process.env,
            DOCKER_CLI_HINTS: 'false'
        }
    });

    await new Promise((res) => { copyProcess.on('close', res) });

    await dockerStop(id);

    const tempPath = path.join(process.cwd(), func.path, 'code.tar.gz');
    if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { force: true });
    }
}

async function dockerStart(func, variables, port) {
   const runtimeChunks = func.runtime.split("-");
   const runtimeVersion = runtimeChunks.pop();
   const runtimeName = runtimeChunks.join("-");
    const imageName = `openruntimes/${runtimeName}:${openRuntimesVersion}-${runtimeVersion}`;

    const tool = systemTools[runtimeName];

    const functionDir = path.join(process.cwd(), func.path);

    const id = func.$id;

    const params = [ 'run' ];
    params.push('--rm');
    params.push('--name', id);
    params.push('-p', `${port}:3000`);
    params.push('-e', 'APPWRITE_ENV=development');
    params.push('-e', 'OPEN_RUNTIMES_ENV=development');
    params.push('-e', 'OPEN_RUNTIMES_SECRET=');

   for(const k of Object.keys(variables)) {
        params.push('-e', `${k}=${variables[k]}`);
    }

    params.push('-v', `${functionDir}/.appwrite/logs.txt:/mnt/logs/dev_logs.log:rw`);
    params.push('-v', `${functionDir}/.appwrite/errors.txt:/mnt/logs/dev_errors.log:rw`);
    params.push('-v', `${functionDir}/.appwrite/build.tar.gz:/mnt/code/code.tar.gz:ro`);
    params.push(imageName, 'sh', '-c', `helpers/start.sh "${tool.startCommand}"`);

    const startProcess = childProcess.spawn('docker', params, {
        stdio: 'pipe',
        pwd: functionDir,
        env: {
            ...process.env,
            DOCKER_CLI_HINTS: 'false'
        }
    });

    startProcess.stdout.on('data', (data) => {
        process.stdout.write(chalk.blackBright(data));
    });

    startProcess.stderr.on('data', (data) => {
        process.stdout.write(chalk.blackBright(data));
    });

    success(`Visit http://localhost:${port}/ to execute your function.`);
}

async function dockerCleanup(functionId) {
    await dockerStop(functionId);

    const func = localConfig.getFunction(functionId);
    const appwritePath = path.join(process.cwd(), func.path, '.appwrite');
    if (fs.existsSync(appwritePath)) {
        fs.rmSync(appwritePath, { recursive: true, force: true });
    }

    const tempPath = path.join(process.cwd(), func.path, 'code.tar.gz');
    if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { force: true });
    }
}

module.exports = {
    dockerPull,
    dockerBuild,
    dockerStart,
    dockerCleanup,
    dockerStop,
}
