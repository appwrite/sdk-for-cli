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
const { login, logout } = require("./lib/commands/generic");
const { init } = require("./lib/commands/init");
const { deploy } = require("./lib/commands/deploy");
const { account } = require("./lib/commands/account");
const { avatars } = require("./lib/commands/avatars");
const { console } = require("./lib/commands/console");
const { databases } = require("./lib/commands/databases");
const { functions } = require("./lib/commands/functions");
const { graphql } = require("./lib/commands/graphql");
const { health } = require("./lib/commands/health");
const { locale } = require("./lib/commands/locale");
const { projects } = require("./lib/commands/projects");
const { storage } = require("./lib/commands/storage");
const { teams } = require("./lib/commands/teams");
const { users } = require("./lib/commands/users");
const { flutter } = require("./lib/commands/flutter");
const { generate } = require("./lib/commands/generate");

program
  .description(commandDescriptions['main'])
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
    sortSubcommands: true
  })
  .version(version, "-v, --version")
  .option("--verbose", "Show complete error log")
  .option("--json", "Output in JSON format")
  .on("option:json", () => {
    cliConfig.json = true;
  })
  .on("option:verbose", () => {
    cliConfig.verbose = true;
  })
  .showSuggestionAfterError()
  .addCommand(login)
  .addCommand(init)
  .addCommand(deploy)
  .addCommand(logout)
  .addCommand(account)
  .addCommand(avatars)
  .addCommand(console)
  .addCommand(databases)
  .addCommand(functions)
  .addCommand(graphql)
  .addCommand(health)
  .addCommand(locale)
  .addCommand(projects)
  .addCommand(storage)
  .addCommand(teams)
  .addCommand(users)
  .addCommand(client)
  .addCommand(flutter)
  .addCommand(generate)
  .parse(process.argv);
  
process.stdout.columns = oldWidth;