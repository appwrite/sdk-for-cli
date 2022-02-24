#! /usr/bin/env node
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
const { database } = require("./lib/commands/database");
const { functions } = require("./lib/commands/functions");
const { health } = require("./lib/commands/health");
const { locale } = require("./lib/commands/locale");
const { projects } = require("./lib/commands/projects");
const { storage } = require("./lib/commands/storage");
const { teams } = require("./lib/commands/teams");
const { users } = require("./lib/commands/users");

program
  .description(commandDescriptions['main'])
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
  .addCommand(database)
  .addCommand(functions)
  .addCommand(health)
  .addCommand(locale)
  .addCommand(projects)
  .addCommand(storage)
  .addCommand(teams)
  .addCommand(users)
  .addCommand(client)
  .parse(process.argv);
  