const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const inquirer = require("inquirer");
const { teamsCreate, teamsList } = require("./teams");
const { projectsCreate, projectsCreatePlatform, projectsListPlatforms } = require("./projects");
const { sdkForConsole } = require("../sdks");
const { questionsConfigureFlutter, questionsFlutterSelectPlatforms } = require("../questions");
const { success, log, actionRunner, commandDescriptions, error } = require("../parser");
const { Command } = require("commander");
const { name } = require("tar/lib/types");
const { globalConfig } = require("../config");

const appwriteFile = 'aW1wb3J0ICdwYWNrYWdlOmFwcHdyaXRlL2FwcHdyaXRlLmRhcnQnOwoKZmluYWwgY2xpZW50ID0gQ2xpZW50KCkKICAuc2V0RW5kcG9pbnQoJ3tFTkRQT0lOVH0nKQogIC5zZXRQcm9qZWN0KCd7UFJPSkVDVH0nKTsKCmZpbmFsIGFjY291bnQgPSBBY2NvdW50KGNsaWVudCk7CmZpbmFsIGRhdGFiYXNlcyA9IERhdGFiYXNlcyhjbGllbnQpOwpmaW5hbCBzdG9yYWdlID0gU3RvcmFnZShjbGllbnQpOwoK';

const flutter = new Command("flutter")
    .description("Configure Flutter project to use Appwrite")
    .configureHelp({
        helpWidth: process.stdout.columns || 80
    })
    .action(actionRunner(async (_options, command) => {
        command.help();
    }));

const configure = async (options) => {
    const filePath = path.join('./', 'pubspec.yaml');
    if (!fs.existsSync(filePath)) {
        error("Unable to find `pubspec.yaml` file. Not a valid Flutter project.");
        return;
    }

    let response = {}
    let answers = await inquirer.prompt(questionsConfigureFlutter)
    if (!answers.project) process.exit(1)

    let sdk = await sdkForConsole();
    let project = {};
    if (answers.start == "new") {
        response = await teamsCreate({
            teamId: 'unique()',
            name: answers.project,
            sdk,
            parseOutput: false
        })

        let teamId = response['$id'];
        response = await projectsCreate({
            projectId: answers.id,
            name: answers.project,
            teamId,
            parseOutput: false
        })

        project = response;
    } else {
        project = answers.project;
    }
    if (!project.id) {
        fail("Unable to get project. Try again.");
    }

    // add appwrite dependency
    addAppwriteDependency('./pubspec.yaml');

    const appwriteFilePath = './lib/appwrite.dart';
    await initializeSDK(appwriteFilePath, project.id, globalConfig.getEndpoint());

    // Which platforms to support?
    let platforms = options.platforms?.split(',')?.map(platform => platform.toLowerCase());

    if (!platforms || !platforms.length) {
        platforms = await inquirer.prompt(questionsFlutterSelectPlatforms);
        platforms = platforms.platforms.map(platform => platform.toLowerCase());
    }

    if (!platforms.length) {
        error('No platforms selected');
        return;
    }

    //get android package name
    let androidPackageName = options.androidPackageName;
    let iosBundleId = options.iosBundleId;
    let macosBundleId = options.macosBundleId;

    let projectName = getPubspecName('./pubspec.yaml');
    log('Project Name: ' + projectName);

    response = await projectsListPlatforms({ projectId: project.id, sdk, parseOutput: false })

    let existingPlatforms = response.platforms;

    // select platform
    if (platforms.includes('android')) {
        if (!androidPackageName) {
            const manifestPath = path.join('./android', 'app/src/main/AndroidManifest.xml');
            androidPackageName = getAndroidPackageName(manifestPath);
            if (!androidPackageName) {
                error('Unable to determine android package name. Please provide using --androidPackageName');
                return;
            }
            log('Infered Android Package Name: ' + androidPackageName);
        }
        const exists = existingPlatforms.find(platform => platform.key === androidPackageName && platform.type === 'flutter-android');
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'flutter-android',
                name: `${projectName} (android)`,
                key: androidPackageName,
                sdk,
                parseOutput: false
            });
            success(`Android platform: ${androidPackageName} added successfully`);
        } else {
            success(`Android platform: ${androidPackageName} already exists`);
        }
    }
    if (platforms.includes('ios')) {
        if (!iosBundleId) {
            const iosProjectPath = path.join('./ios/', 'Runner.xcodeproj/project.pbxproj');
            iosBundleId = getIOSBundleId(iosProjectPath);
            if (!iosBundleId) {
                error('Unable to determine iOS bundle ID. Please provide using --iosBundleId');
                return;
            }
            log('Infered iOS bundle ID: ' + iosBundleId);
        }
        const exists = existingPlatforms.find(platform => platform.key === iosBundleId && platform.type === 'flutter-ios');
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'flutter-ios',
                name: `${projectName} (iOS)`,
                key: iosBundleId,
                sdk,
                parseOutput: false
            });
            success(`iOS platform: ${iosBundleId} added successfully`);
        } else {
            success(`iOS platform: ${iosBundleId} already exists`);
        }
    }
    if (platforms.includes('macos')) {
        if (!macosBundleId) {
            const macosConfigPath = path.join('./macos/', 'Runner/Configs/AppInfo.xcconfig')
            macosBundleId = getMacOSBundleId(macosConfigPath);
            if (!macosBundleId) {
                error('Unable to determine MacOS bundle ID. Please provide using --macosBundleId');
                return;
            }
            log('Infered MacOS bundle ID: ' + macosBundleId);
        }
        const exists = existingPlatforms.find(platform => platform.key === macosBundleId && platform.type === 'flutter-macos');
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'flutter-macos',
                name: `${projectName} (MacOS)`,
                key: macosBundleId,
                sdk,
                parseOutput: false
            });
            success(`MacOS platform: ${macosBundleId} added successfully`);
        } else {
            success(`MacOS platform: ${macosBundleId} already exists`);
        }
    }

    if (platforms.includes('linux')) {
        const exists = existingPlatforms.find(platform => platform.key === projectName && platform.type === 'flutter-linux');
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'flutter-linux',
                name: `${projectName} (Linux)`,
                key: projectName,
                sdk,
                parseOutput: false
            })
            success(`Linux platform: ${projectName} added successfully`);
        } else {
            success(`Linux platform: ${projectName} already exists`);
        }
    }

    if (platforms.includes('windows')) {
        const exists = existingPlatforms.find(platform => platform.key === projectName && platform.type === 'flutter-windows');
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'flutter-windows',
                name: `${projectName} (Windows)`,
                key: projectName,
                sdk,
                parseOutput: false
            })
            success(`Windows platform: ${projectName} added successfully`);
        } else {
            success(`Windows platform: ${projectName} already exists`);
        }
    }

    if(platforms.includes('web')) {
        if(!options.webHostname) {
            error('Please provide --webHostname to add web platform');
            return;
        }
        const exists = existingPlatforms.find(platform => (platform.hostname === options.webHostname && platform.type === 'web') || (platforms.hostname === options.webHostname && platform.type === 'flutter-web'));
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'web',
                name: `${projectName} (Windows)`,
                hostname: options.webHostname,
                sdk,
                parseOutput: false
            })
            success(`Web platform: ${options.webHostname} added successfully`);
        } else {
            success(`Web platform: ${options.webHostname} already exists`);
        }
    }


}

const initializeSDK = async (path, projectId, endpoint) => {
    if (fs.existsSync(path)) {
        let response = await inquirer.prompt({
            type: "confirm",
            name: "overwrite",
            message:
                `Appwrite file ( ${path} ) already exists. Do you want to overwrite?`,
        })
        if (!response.overwrite) {
            log('appwrite.dart already exists. Not overwriting')
            return;
        } else {
            log('Overwriting appwrite.dart')
        }
    }
    const buffer = Buffer.from(appwriteFile, 'base64');

    let decodedString = buffer.toString('utf8');
    decodedString = decodedString.replace('{PROJECT}', projectId);
    decodedString = decodedString.replace('{ENDPOINT}', endpoint);

    fs.writeFileSync(path, decodedString);
    success('SDK initialized successfully');
}

const getAndroidPackageName = (manifestPath) => {

    if (!fs.existsSync(manifestPath)) {
        return null;
    }

    const manifestXml = fs.readFileSync(manifestPath, 'utf8');

    // Define a regular expression to match the package attribute
    const regex = /package="([^"]+)"/;

    // Search for the package attribute in the manifest file using the regular expression
    const match = manifestXml.match(regex);

    // Extract the package name from the match
    const packageName = match[1];
    return packageName;
}

const getPubspecName = (pubspecPath) => {

    const yamlFile = fs.readFileSync(pubspecPath, 'utf8');
    const regex = /^name:\s*(.*)$/m;

    const match = yamlFile.match(regex);
    const name = match[1];

    return name;

}

const addAppwriteDependency = (pubspecPath) => {
    // need to add appropriate version ?
    const file = fs.readFileSync(pubspecPath, 'utf8');
    if (!file.includes('appwrite:')) {
        const out = file.replace('dependencies:', 'dependencies:\n  appwrite:');
        fs.writeFileSync(pubspecPath, out);
        log('Added appwrite SDK');
    } else {
        log('Appwrite SDK already added');
    }
}

const getIOSBundleId = (projectPath) => {
    if (!fs.existsSync(projectPath)) {
        return null;
    }

    const projectFile = fs.readFileSync(projectPath, 'utf8');

    const regex = /PRODUCT_BUNDLE_IDENTIFIER = ([^;]+)/;
    const match = projectFile.match(regex);

    const bundleId = match[1];
    return bundleId;

}

const getMacOSBundleId = (projectPath) => {
    if (!fs.existsSync(projectPath)) {
        return null;
    }

    const projectFile = fs.readFileSync(projectPath, 'utf8');
    const regex = /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*([^;\n]+)/;

    const match = projectFile.match(regex);
    const bundleId = match[1];

    return bundleId;
}



flutter.command("configure")
    .description("Configure Flutter Appwrite project")
    .option('--androidPackageName <androidPackageName>', 'Android package name. If not provided will try to read from AndroidManifest.xml file')
    .option('--iosBundleId <iosBundleId>', 'iOS bundle identifier. If not provided will try to read from iOS project')
    .option('--platforms <platforms>', 'Comma separated platforms. If not provided you will be listed with platforms to choose.')
    .option('--webHostname <webHostname>', 'Comma separated platforms. If not provided you will be listed with platforms to choose.')
    .action(actionRunner(configure));

module.exports = {
    flutter,
}