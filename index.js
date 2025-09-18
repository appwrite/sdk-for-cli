#! /usr/bin/env node

/** Required to set max width of the help commands */
const oldWidth = process.stdout.columns
process.stdout.columns = 100
/** ---------------------------------------------- */

const program = require("commander");
const chalk = require("chalk");
const { version } = require("./package.json");
const { commandDescriptions, cliConfig } = require("./lib/parser");
const { client } = require("./lib/commands/generic");
const { getLatestVersion, compareVersions } = require("./lib/utils");
const inquirer = require("inquirer");
const { login, logout, whoami, migrate, register } = require("./lib/commands/generic");
const { init } = require("./lib/commands/init");
const { types } = require("./lib/commands/types");
const { pull } = require("./lib/commands/pull");
const { run } = require("./lib/commands/run");
const { push, deploy } = require("./lib/commands/push");
const { update } = require("./lib/commands/update");
const { account } = require("./lib/commands/account");
const { console } = require("./lib/commands/console");
const { databases } = require("./lib/commands/databases");
const { functions } = require("./lib/commands/functions");
const { graphql } = require("./lib/commands/graphql");
const { health } = require("./lib/commands/health");
const { locale } = require("./lib/commands/locale");
const { messaging } = require("./lib/commands/messaging");
const { migrations } = require("./lib/commands/migrations");
const { project } = require("./lib/commands/project");
const { projects } = require("./lib/commands/projects");
const { proxy } = require("./lib/commands/proxy");
const { sites } = require("./lib/commands/sites");
const { storage } = require("./lib/commands/storage");
const { tablesDB } = require("./lib/commands/tables-db");
const { teams } = require("./lib/commands/teams");
const { tokens } = require("./lib/commands/tokens");
const { users } = require("./lib/commands/users");
const { vcs } = require("./lib/commands/vcs");

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

/**
 * Check for updates and show version information
 */
async function checkVersion() {
    process.stdout.write(chalk.bold(`appwrite version ${version}`) + '\n');
    
    try {
        const latestVersion = await getLatestVersion();
        const comparison = compareVersions(version, latestVersion);
        
        if (comparison > 0) {
            // Current version is older than latest
            process.stdout.write(chalk.yellow(`\n⚠️  A newer version is available: ${chalk.bold(latestVersion)}`) + '\n');
            process.stdout.write(chalk.cyan(`💡 Run '${chalk.bold('appwrite update')}' to update to the latest version.`) + '\n');
        } else if (comparison === 0) {
            process.stdout.write(chalk.green('\n✅ You are running the latest version!') + '\n');
        } else {
            // Current version is newer than latest (pre-release/dev)
            process.stdout.write(chalk.blue('\n🚀 You are running a pre-release or development version.') + '\n');
        }
    } catch (error) {
        // Silently fail version check, just show current version
        process.stdout.write(chalk.gray('\n(Unable to check for updates)') + '\n');
    }
}

// Intercept version flag before Commander.js processes it
if (process.argv.includes('-v') || process.argv.includes('--version')) {
    (async () => {
        await checkVersion();
        process.exit(0);
    })();
    return;
}

program
  .description(commandDescriptions['main'])
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
    sortSubcommands: true,
  })
  .helpOption('-h, --help', "Display help for command")
  .version(version, "-v, --version", "Output the version number")
  .option("-V, --verbose", "Show complete error log")
  .option("-j, --json", "Output in JSON format")
  .hook('preAction', migrate)
  .option("-f,--force", "Flag to confirm all warnings")
  .option("-a,--all", "Flag to push all resources")
  .option("--id [id...]", "Flag to pass a list of ids for a given action")
  .option("--report", "Enable reporting in case of CLI errors")
  .on("option:json", () => {
    cliConfig.json = true;
  })
  .on("option:verbose", () => {
    cliConfig.verbose = true;
  })
  .on("option:report", function() {
    cliConfig.report = true;
    cliConfig.reportData = { data: this };
  })
  .on("option:force", () => {
    cliConfig.force = true;
  })
  .on("option:all", () => {
    cliConfig.all = true;
  })
  .on("option:id", function() {
    cliConfig.ids = this.opts().id;
  })
  .showSuggestionAfterError()
  .addCommand(whoami)
  .addCommand(register)
  .addCommand(login)
  .addCommand(init)
  .addCommand(pull)
  .addCommand(push)
  .addCommand(types)
  .addCommand(deploy)
  .addCommand(run)
  .addCommand(update)
  .addCommand(logout)
  .addCommand(account)
  .addCommand(console)
  .addCommand(databases)
  .addCommand(functions)
  .addCommand(graphql)
  .addCommand(health)
  .addCommand(locale)
  .addCommand(messaging)
  .addCommand(migrations)
  .addCommand(project)
  .addCommand(projects)
  .addCommand(proxy)
  .addCommand(sites)
  .addCommand(storage)
  .addCommand(tablesDB)
  .addCommand(teams)
  .addCommand(tokens)
  .addCommand(users)
  .addCommand(vcs)
  .addCommand(client)
  .parse(process.argv);

process.stdout.columns = oldWidth;
