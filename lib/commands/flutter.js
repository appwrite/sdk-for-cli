const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const inquirer = require("inquirer");
const { teamsCreate, teamsList } = require("./teams");
const { projectsCreate, projectsCreatePlatform } = require("./projects");
const { sdkForConsole } = require("../sdks");
const { questionsConfigureFlutter } = require("../questions");
const { success, log, actionRunner, commandDescriptions, error } = require("../parser");
const { Command } = require("commander");

const flutter = new Command("flutter")
    .description("Configure Flutter project to use Appwrite")
    .configureHelp({
        helpWidth: process.stdout.columns || 80
    })
    .action(actionRunner(async(_options, command) => {
        command.help();
    }));

const configure = async () => {
    const filePath = path.join('./', 'pubspec.yaml');
    if(!fs.existsSync(filePath)) {
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
    if(!project.id) {
        fail("Unable to get project. Try again.");
    }

    // Which platforms to support?

    //get android package name
    const manifestPath = path.join('./android', 'app/src/main/AndroidManifest.xml');
    let packageName = getAndroidPackageName(manifestPath);
    if(!packageName) {
        packageName = 'com.example.testandroidapp';
    }
    console.log(packageName);
    // select platform
    response = await projectsCreatePlatform({
        projectId: project.id,
        type: 'flutter-android',
        name: 'Flutter Android',
        key: packageName,
        sdk,
        parseOutput: false
    });
    console.log(response);
    
}

const getAndroidPackageName = (manifestPath) => {

    if(!fs.existsSync(manifestPath)) {
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


flutter.command("configure")
    .description("Configure Flutter Appwrite project")
    .action(actionRunner(configure));

module.exports = {
    flutter,
}