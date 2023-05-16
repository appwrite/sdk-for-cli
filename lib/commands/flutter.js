const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { teamsCreate } = require("./teams");
const { projectsCreate, projectsCreatePlatform, projectsListPlatforms } = require("./projects");
const { sdkForConsole } = require("../sdks");
const { questionsFlutterConfigure, questionsFlutterSelectPlatforms, questionsFlutterChooseDatabase, questionsFlutterChooseProject } = require("../questions");
const { success, log, actionRunner, error } = require("../parser");
const { Command } = require("commander");
const { globalConfig, localConfig } = require("../config");
const { databasesList, databasesListCollections } = require("./databases");
const { sdkForProject } = require("../sdks");
const { toSnakeCase, toUpperCamelCase } = require("../utils");

const appwriteFile = 'aW1wb3J0ICdwYWNrYWdlOmFwcHdyaXRlL2FwcHdyaXRlLmRhcnQnOwoKZmluYWwgY2xpZW50ID0gQ2xpZW50KCkKICAuc2V0RW5kcG9pbnQoJ3tFTkRQT0lOVH0nKQogIC5zZXRQcm9qZWN0KCd7UFJPSkVDVH0nKTsKCmZpbmFsIGFjY291bnQgPSBBY2NvdW50KGNsaWVudCk7CmZpbmFsIGRhdGFiYXNlcyA9IERhdGFiYXNlcyhjbGllbnQpOwpmaW5hbCBzdG9yYWdlID0gU3RvcmFnZShjbGllbnQpOwoK';

const modelTemplate = 'JUlNUE9SVFMlCmNsYXNzICVOQU1FJSB7CiAgZmluYWwgU3RyaW5nICRpZDsKICBmaW5hbCBTdHJpbmcgJGNyZWF0ZWRBdDsKICBmaW5hbCBTdHJpbmcgJHVwZGF0ZWRBdDsKICBmaW5hbCBTdHJpbmcgJGNvbGxlY3Rpb25JZDsKICBmaW5hbCBTdHJpbmcgJGRhdGFiYXNlSWQ7CiAgZmluYWwgTGlzdDxTdHJpbmc+ICRwZXJtaXNzaW9uczsKCiAgJUFUVFJJQlVURVMlCgogICVOQU1FJSh7CiAgICByZXF1aXJlZCB0aGlzLiRpZCwKICAgIHJlcXVpcmVkIHRoaXMuJGNyZWF0ZWRBdCwKICAgIHJlcXVpcmVkIHRoaXMuJHVwZGF0ZWRBdCwKICAgIHJlcXVpcmVkIHRoaXMuJGNvbGxlY3Rpb25JZCwKICAgIHJlcXVpcmVkIHRoaXMuJHBlcm1pc3Npb25zLAogICAgcmVxdWlyZWQgdGhpcy4kZGF0YWJhc2VJZCwKICAgICVDT05TVFJVQ1RPUl9QQVJBTUVURVJTJQogIH0pOwoKICBmYWN0b3J5ICVOQU1FJS5mcm9tTWFwKE1hcDxTdHJpbmcsIGR5bmFtaWM+IG1hcCkgewogICAgcmV0dXJuICVOQU1FJSgKICAgICAgJGlkOiBtYXBbJ1wkaWQnXSwKICAgICAgJGNyZWF0ZWRBdDogbWFwWydcJGNyZWF0ZWRBdCddLAogICAgICAkdXBkYXRlZEF0OiBtYXBbJ1wkdXBkYXRlZEF0J10sCiAgICAgICRjb2xsZWN0aW9uSWQ6IG1hcFsnXCRjb2xsZWN0aW9uSWQnXSwKICAgICAgJHBlcm1pc3Npb25zOiBMaXN0PFN0cmluZz4uZnJvbShtYXBbJ1wkcGVybWlzc2lvbnMnXSksCiAgICAgICRkYXRhYmFzZUlkOiBtYXBbJ1wkZGF0YWJhc2VJZCddLAogICAgICAlQ09OU1RSVUNUT1JfQVJHVU1FTlRTJQogICAgKTsKICB9CgogIE1hcDxTdHJpbmcsIGR5bmFtaWM+IHRvTWFwKCkgewogICAgcmV0dXJuIHsKICAgICAgJ1wkaWQnOiAkaWQsCiAgICAgICdcJGNyZWF0ZWRBdCc6ICRjcmVhdGVkQXQsCiAgICAgICdcJHVwZGF0ZWRBdCc6ICR1cGRhdGVkQXQsCiAgICAgICdcJGNvbGxlY3Rpb25JZCc6ICRjb2xsZWN0aW9uSWQsCiAgICAgICdcJHBlcm1pc3Npb25zJzogJHBlcm1pc3Npb25zLAogICAgICAnXCRkYXRhYmFzZUlkJzogJGRhdGFiYXNlSWQsCiAgICAgICVNQVBfRklFTERTJQogICAgfTsKICB9CgogIEBvdmVycmlkZQogIFN0cmluZyB0b1N0cmluZygpIHsKICAgIHJldHVybiAnJU5BTUUlICcgKyB0b01hcCgpLnRvU3RyaW5nKCk7CiAgfQp9';

const flutter = new Command("flutter")
    .description("Configure Flutter project to use Appwrite")
    .configureHelp({
        helpWidth: process.stdout.columns || 80
    })
    .action(actionRunner(async (_options, command) => {
        command.help();
    }));

const generate = async (options) => {
    let modelPath = options.modelPath ?? './lib/models/';
    if (!modelPath.endsWith('/')) {
        modelPath += '/';
    }
    let projectId = options.projectId ?? localConfig.getProject().projectId;
    let databaseIds = options.databaseIds?.split(',');

    if (!projectId) {
        let answer = await inquirer.prompt(questionsFlutterChooseProject);
        if (!answer.project) {
            error('You must select a project.');
            return;
        }
        projectId = answer.project.id;
        localConfig.setProject(projectId);
    }


    if (!databaseIds) {
        answer = await inquirer.prompt(questionsFlutterChooseDatabase);

        if (!answer.databases.length) {
            error('Please select at least one database');
            return;
        }
        databaseIds = answer.databases.map(database => database.id);
    }

    const sdk = await sdkForProject();
    for (let index in databaseIds) {
        let id = databaseIds[index];
        let response = await databasesListCollections({
            databaseId: id,
            sdk,
            parseOutput: false
        });

        let collections = response.collections;

        for (let index in collections) {
            const collection = collections[index];
            const filename = toSnakeCase(collection.$id) + '.dart';
            const className = toUpperCamelCase(collection.$id);

            const buffer = Buffer.from(modelTemplate, 'base64');

            let template = buffer.toString('utf8');
            let dartClass = generateDartClass(className, collection.attributes, template);
            if (!fs.existsSync(modelPath)) {
                fs.mkdirSync(modelPath, { recursive: true });
            }
            fs.writeFileSync(modelPath + filename, dartClass);
            success(`Generated ${className} class and saved to ${modelPath + filename}`);
        }
    }
}


function generateDartClass(name, attributes, template) {
    let imports = '';

    const getType = (attribute) => {
        switch (attribute.type) {
            case 'string':
            case 'email':
            case 'url':
            case 'enum':
            case 'datetime':
                return attribute.array ? 'List<String>' : 'String';
            case 'boolean':
                return attribute.array ? 'List<bool>' : 'bool';
            case 'integer':
                return attribute.array ? 'List<int>' : 'int';
            case 'double':
                return attribute.array ? 'List<double>' : 'double';
            case 'relationship':
                if(imports.indexOf(toSnakeCase(attribute.relatedCollection)) === -1) {
                    imports += `import './${toSnakeCase(attribute.relatedCollection)}.dart';\n`;
                }

                if((attribute.relationType === 'oneToMany' && attribute.side === 'parent') || (attribute.relationType === 'manyToOne' && attribute.side === 'child') || attribute.relationType === 'manyToMany' ) {

                    return `List<${toUpperCamelCase(attribute.relatedCollection)}>`;
                }
                return toUpperCamelCase(attribute.relatedCollection);
        }
    }

    const getFromMap = (attr) => {
        if(attr.type === 'relationship') {
            if((attr.relationType === 'oneToMany' && attr.side === 'parent') || (attr.relationType === 'manyToOne' && attr.side === 'child') || attr.relationType === 'manyToMany') {
                return `${getType(attr)}.from((map['${attr.key}'] ?? []).map((p) => ${toUpperCamelCase(attr.relatedCollection)}.fromMap(p)))`;
            }
            return `map['${attr.key}'] != null ? ${getType(attr)}.fromMap(map['${attr.key}']) : null`;
        }
        if(attr.array) {
            return `${getType(attr)}.from(map['${attr.key}'])`;
        }
        return `map['${attr.key}']`;
    }
    const properties = attributes.map(attr => {
        let property = `final ${getType(attr)}${(!attr.required) ? '?' : ''} ${attr.key}`;
        property += ';';
        return property;
    }).join('\n  ');

    const constructorParams = attributes.map(attr => {
        let out = '';
        if (attr.required) {
            out += 'required ';
        }
        out += `this.${attr.key}`;
        if (attr.default && attr.default !== null) {
            out += ` = ${JSON.stringify(attr.default)}`;
        }
        return out;
    }).join(',\n    ');

    const constructorArgs = attributes.map(attr => {
        return `${attr.key}: ${getFromMap(attr)}`;
    }).join(',\n      ');

    const mapFields = attributes.map(attr => {
        let out = `'${attr.key}': `;
        if(attr.type === 'relationship') {
            if((attr.relationType === 'oneToMany' && attr.side === 'parent') || (attr.relationType === 'manyToOne' && attr.side === 'child') || attr.relationType === 'manyToMany') {
                return `${out}${attr.key}?.map((p) => p.toMap())`;
            }
            return `${out}${attr.key}?.toMap()`;
        }
        return `${out}${attr.key}`;
    }).join(',\n      ');

    return template
        .replaceAll('%NAME%', name)
        .replace('%IMPORTS%', imports)
        .replace('%ATTRIBUTES%', properties)
        .replace('%CONSTRUCTOR_PARAMETERS%', constructorParams)
        .replace('%CONSTRUCTOR_ARGUMENTS%', constructorArgs)
        .replace('%MAP_FIELDS%', mapFields);
}

const configure = async (options) => {
    const filePath = path.join('./', 'pubspec.yaml');
    if (!fs.existsSync(filePath)) {
        error("Unable to find `pubspec.yaml` file. Not a valid Flutter project.");
        return;
    }

    let projectId = options.projectId ?? localConfig.getProject().projectId;

    let response = {}

    if(!projectId) {

        let answers = await inquirer.prompt(questionsFlutterConfigure)
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
        localConfig.setProject(project.id, project.name);
        projectId = project.id;
    }

    // add appwrite dependency
    addAppwriteDependency('./pubspec.yaml');

    const appwriteFilePath = './lib/appwrite.dart';
    await initializeSDK(appwriteFilePath, projectId, globalConfig.getEndpoint());

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

    if (platforms.includes('web')) {
        let hostname = options.webHostname;
        if (!hostname) {
            let answer = await inquirer.prompt({
                type: "input",
                name: "hostname",
                message: "What is your web app hostname?",
                default: "localhost"
            },);
            hostname = answer.hostname;
            if (!hostname) {
                error('Please provide Hostname to add web platform');
            }
            return;
        }
        const exists = existingPlatforms.find(platform => (platform.hostname === options.webHostname && platform.type === 'web') || (platforms.hostname === options.webHostname && platform.type === 'flutter-web'));
        if (!exists) {
            response = await projectsCreatePlatform({
                projectId: project.id,
                type: 'web', // TODO change to `flutter-web` once cloud fixed
                name: `${projectName} (Web)`,
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
        success('Added appwrite SDK');
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

flutter.command("generate")
    .description("Generate dart classes for collections")
    .option('--modelPath <modelPath>', 'Path where the generated models are saved. By default it\'s saved to lib/models folder.')
    .option('--projectId <projectId>', 'Project ID to use to generate models for database. If not provided you will be requested to select.')
    .option('--databaseIds <databaseIds>', 'Comma separated database IDs to generate models for. If not provided you will be requested to choose.')
    .action(actionRunner(generate));

module.exports = {
    flutter,
}