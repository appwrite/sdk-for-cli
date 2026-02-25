#! /usr/bin/env node

/** Required to set max width of the help commands */
const oldWidth = process.stdout.columns;
process.stdout.columns = 100;
/** ---------------------------------------------- */

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';

import packageJson from './package.json' with { type: 'json' };
import { commandDescriptions, cliConfig } from './lib/parser.js';
import { getLatestVersion, compareVersions } from './lib/utils.js';
import inquirerSearchList from 'inquirer-search-list';

import { client } from './lib/commands/generic.js';
import { login, logout, whoami, migrate, register } from './lib/commands/generic.js';
import { init } from './lib/commands/init.js';
import { types } from './lib/commands/types.js';
import { pull } from './lib/commands/pull.js';
import { run } from './lib/commands/run.js';
import { push, deploy } from './lib/commands/push.js';
import { update } from './lib/commands/update.js';
import { generate } from './lib/commands/generate.js';

import { account } from './lib/commands/services/account.js';
import { activities } from './lib/commands/services/activities.js';
import { backups } from './lib/commands/services/backups.js';
import { databases } from './lib/commands/services/databases.js';
import { functions } from './lib/commands/services/functions.js';
import { graphql } from './lib/commands/services/graphql.js';
import { health } from './lib/commands/services/health.js';
import { locale } from './lib/commands/services/locale.js';
import { messaging } from './lib/commands/services/messaging.js';
import { migrations } from './lib/commands/services/migrations.js';
import { project } from './lib/commands/services/project.js';
import { projects } from './lib/commands/services/projects.js';
import { proxy } from './lib/commands/services/proxy.js';
import { sites } from './lib/commands/services/sites.js';
import { storage } from './lib/commands/services/storage.js';
import { tablesDB } from './lib/commands/services/tables-db.js';
import { teams } from './lib/commands/services/teams.js';
import { tokens } from './lib/commands/services/tokens.js';
import { users } from './lib/commands/services/users.js';
import { vcs } from './lib/commands/services/vcs.js';

const { version } = packageJson;
inquirer.registerPrompt('search-list', inquirerSearchList);

/**
 * Check for updates and show version information
 */
async function checkVersion(): Promise<void> {
    process.stdout.write(chalk.bold(`appwrite version ${version}`) + '\n');

    try {
        const latestVersion = await getLatestVersion();
        const comparison = compareVersions(version, latestVersion);

        if (comparison > 0) {
            // Current version is older than latest
            process.stdout.write(
                chalk.yellow(`\n⚠️  A newer version is available: ${chalk.bold(latestVersion)}`) + '\n'
            );
            process.stdout.write(
                chalk.cyan(
                    `💡 Run '${chalk.bold('appwrite update')}' to update to the latest version.`
                ) + '\n'
            );
        } else if (comparison === 0) {
            process.stdout.write(chalk.green('\n✅ You are running the latest version!') + '\n');
        } else {
            // Current version is newer than latest (pre-release/dev)
            process.stdout.write(chalk.blue('\n🚀 You are running a pre-release or development version.') + '\n');
        }
    } catch (_error) {
        // Silently fail version check, just show current version
        process.stdout.write(chalk.gray('\n(Unable to check for updates)') + '\n');
    }
}

// Intercept version flag before Commander.js processes it
if (process.argv.includes('-v') || process.argv.includes('--version')) {
    void (async () => {
        await checkVersion();
        process.exit(0);
    })();
} else {
    program
        .description(commandDescriptions['main'])
        .configureHelp({
            helpWidth: process.stdout.columns || 80,
            sortSubcommands: true,
        })
        .helpOption('-h, --help', 'Display help for command')
        .version(version, '-v, --version', 'Output the version number')
        .option('-V, --verbose', 'Show complete error log')
        .option('-j, --json', 'Output in JSON format')
        .hook('preAction', migrate)
        .option('-f,--force', 'Flag to confirm all warnings')
        .option('-a,--all', 'Flag to push all resources')
        .option('--id [id...]', 'Flag to pass a list of ids for a given action')
        .option('--report', 'Enable reporting in case of CLI errors')
        .on('option:json', () => {
            cliConfig.json = true;
        })
        .on('option:verbose', () => {
            cliConfig.verbose = true;
        })
        .on('option:report', function () {
            cliConfig.report = true;
            cliConfig.reportData = { data: this };
        })
        .on('option:force', () => {
            cliConfig.force = true;
        })
        .on('option:all', () => {
            cliConfig.all = true;
        })
        .on('option:id', function () {
            cliConfig.ids = (this.opts().id as string[]);
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
        .addCommand(generate)
        .addCommand(logout)
        .addCommand(account)
        .addCommand(activities)
        .addCommand(backups)
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
}
