const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const inquirer = require("inquirer");
const { teamsCreate, teamsList } = require("./teams");
const { projectsCreate, projectsCreatePlatform, projectsListPlatforms } = require("./projects");
const { sdkForConsole } = require("../sdks");
const { questionsConfigureFlutter } = require("../questions");
const { success, log, actionRunner, commandDescriptions, error } = require("../parser");
const { Command } = require("commander");
const { name } = require("tar/lib/types");

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

    // Which platforms to support?

    //get android package name
    const manifestPath = path.join('./android', 'app/src/main/AndroidManifest.xml');
    let androidPackageName = getAndroidPackageName(manifestPath);
    if (!androidPackageName) {
        androidPackageName = 'com.example.testandroidapp';
    }

    const iosProjectPath = path.join('./ios/', 'Runner.xcodeproj/project.pbxproj');
    let iosBundleId = getIOSBundleId(iosProjectPath);
    log('Infered iOS bundle ID: ' + iosBundleId);
    const macosConfigPath = path.join('./macos/', 'Runner/Configs/AppInfo.xcconfig')
    let macosBundleId = getMacOSBundleId(macosConfigPath);
    log('Infered MacOS bundle ID: ' + macosBundleId);

    let projectName = getPubspecName('./pubspec.yaml');
    log('Project Name: ' + projectName);

    response = await projectsListPlatforms({ projectId: project.id, sdk, parseOutput: false })

    let platforms = response.platforms;

    let exists = {
        android: false,
        ios: false,
        macos: false,
        web: false,
        linux: false,
        windows: false,
    }

    platforms.forEach(platform => {
        if (platform.key === androidPackageName && platform.type === 'flutter-android') {
            exists.android = true;
        }
        if (platform.key === iosBundleId && platform.type === 'flutter-ios') {
            exists.ios = true;
        }
        if (platform.key === macosBundleId && platform.type === 'flutter-macos') {
            exists.macos = true;
        }
        if (platform.key === projectName && platform.type === 'flutter-linux') {
            exists.linux = true;
        }
        if (platform.key === projectName && platform.type === 'flutter-windows') {
            exists.windows = true;
        }
    })

    // select platform
    if(!exists.android) {
        response = await projectsCreatePlatform({
            projectId: project.id,
            type: 'flutter-android',
            name: `${projectName} (android)`,
            key: androidPackageName,
            sdk,
            parseOutput: false
        });
        log(`Android platform: ${androidPackageName} added successfully`);
    }
    if(!exists.ios) {
        response = await projectsCreatePlatform({
            projectId: project.id,
            type: 'flutter-ios',
            name: `${projectName} (iOS)`,
            key: iosBundleId,
            sdk,
            parseOutput: false
        });
        log(`iOS platform: ${iosBundleId} added successfully`);
    }
    if(!exists.macos) {
        response = await projectsCreatePlatform({
            projectId: project.id,
            type: 'flutter-macos',
            name: `${projectName} (MacOS)`,
            key: macosBundleId,
            sdk,
            parseOutput: false
        });
        log(`MacOS platform: ${macosBundleId} added successfully`);
    }

    if(!exists.linux) {
        response = await projectsCreatePlatform({
            projectId: project.id,
            type: 'flutter-linux',
            name: `${projectName} (Linux)`,
            key: projectName,
            sdk,
            parseOutput: false
        })
        log(`Linux platform: ${projectName} added successfully`);
    }

    if(!exists.windows) {
        response = await projectsCreatePlatform({
            projectId: project.id,
            type: 'flutter-windows',
            name: `${projectName} (Windows)`,
            key: projectName,
            sdk,
            parseOutput: false
        })
        log(`Windows platform: ${projectName} added successfully`);
    }


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
    .option('--androidPackageName', 'Android package name. If not provided will try to read from AndroidManifest.xml file')
    .option('--iosBundleId', 'iOS bundle identifier. If not provided will try to read from iOS project')
    .option('--platforms', 'Comma separated platforms. If not provided you will be listed with platforms to choose.')
    .action(actionRunner(configure));

module.exports = {
    flutter,
}