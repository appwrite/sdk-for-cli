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
const inquirer = require("inquirer");
const { login, logout, whoami, migrate, register } = require("./lib/commands/generic");
const { init } = require("./lib/commands/init");
const { pull } = require("./lib/commands/pull");
const { run } = require("./lib/commands/run");
const { push } = require("./lib/commands/push");
const { account } = require("./lib/commands/account");
const { avatars } = require("./lib/commands/avatars");
const { assistant } = require("./lib/commands/assistant");
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
const { storage } = require("./lib/commands/storage");
const { teams } = require("./lib/commands/teams");
const { users } = require("./lib/commands/users");
const { vcs } = require("./lib/commands/vcs");

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

program
  .description(commandDescriptions['main'])
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
    sortSubcommands: true
  })
  .version(version, "-v, --version")
  .option("-V, --verbose", "Show complete error log")
  .option("-j, --json", "Output in JSON format")
  .hook('preAction', migrate)
  .option("-f,--force", "Flag to confirm all warnings")
  .option("-a,--all", "Flag to push all resources")
  .option("--id [id...]", "Flag to pass list of ids for a giving action")
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
  .addCommand(run)
  .addCommand(logout)
  .addCommand(account)
  .addCommand(avatars)
  .addCommand(assistant)
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
  .addCommand(storage)
  .addCommand(teams)
  .addCommand(users)
  .addCommand(vcs)
  .addCommand(client)
  .parse(process.argv);

process.stdout.columns = oldWidth;
