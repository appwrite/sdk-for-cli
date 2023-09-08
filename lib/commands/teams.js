const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const teams = new Command("teams").description(commandDescriptions['teams']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const teamsList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams';
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsCreate = async ({ teamId, name, roles, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} name */
    /* @param {string[]} roles */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams';
    let payload = {};
    
    /** Body Params */

    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    roles = roles === true ? [] : roles;

    if (typeof roles !== 'undefined') {
        payload['roles'] = roles;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsGet = async ({ teamId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsUpdateName = async ({ teamId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsDelete = async ({ teamId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsListLogs = async ({ teamId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/logs'.replace('{teamId}', teamId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsListMemberships = async ({ teamId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsCreateMembership = async ({ teamId, roles, email, userId, phone, url, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string[]} roles */
    /* @param {string} email */
    /* @param {string} userId */
    /* @param {string} phone */
    /* @param {string} url */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
    let payload = {};
    
    /** Body Params */

    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof phone !== 'undefined') {
        payload['phone'] = phone;
    }

    roles = roles === true ? [] : roles;

    if (typeof roles !== 'undefined') {
        payload['roles'] = roles;
    }


    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsGetMembership = async ({ teamId, membershipId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} membershipId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsUpdateMembership = async ({ teamId, membershipId, roles, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} membershipId */
    /* @param {string[]} roles */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
    let payload = {};
    
    /** Body Params */
    roles = roles === true ? [] : roles;

    if (typeof roles !== 'undefined') {
        payload['roles'] = roles;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsDeleteMembership = async ({ teamId, membershipId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} membershipId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsUpdateMembershipStatus = async ({ teamId, membershipId, userId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {string} membershipId */
    /* @param {string} userId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/memberships/{membershipId}/status'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsGetPrefs = async ({ teamId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/prefs'.replace('{teamId}', teamId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const teamsUpdatePrefs = async ({ teamId, prefs, parseOutput = true, sdk = undefined}) => {
    /* @param {string} teamId */
    /* @param {object} prefs */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/teams/{teamId}/prefs'.replace('{teamId}', teamId);
    let payload = {};
    
    /** Body Params */
    if (typeof prefs !== 'undefined') {
        payload['prefs'] = JSON.parse(prefs);
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


teams
    .command(`list`)
    .description(`Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, total`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(teamsList))

teams
    .command(`create`)
    .description(`Create a new team. The user who creates the team will automatically be assigned as the owner of the team. Only the users with the owner role can invite new members, add new owners and delete or update the team.`)
    .requiredOption(`--teamId <teamId>`, `Team ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Team name. Max length: 128 chars.`)
    .option(`--roles [roles...]`, `Array of strings. Use this param to set the roles in the team for the user who created it. The default role is **owner**. A role can be any string. Learn more about [roles and permissions](/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
    .action(actionRunner(teamsCreate))

teams
    .command(`get`)
    .description(`Get a team by its ID. All team members have read access for this resource.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .action(actionRunner(teamsGet))

teams
    .command(`updateName`)
    .description(`Update the team's name by its unique ID.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--name <name>`, `New team name. Max length: 128 chars.`)
    .action(actionRunner(teamsUpdateName))

teams
    .command(`delete`)
    .description(`Delete a team using its ID. Only team members with the owner role can delete the team.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .action(actionRunner(teamsDelete))

teams
    .command(`listLogs`)
    .description(`Get the team activity logs list by its unique ID.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(teamsListLogs))

teams
    .command(`listMemberships`)
    .description(`Use this endpoint to list a team's members using the team's ID. All team members have read access to this endpoint.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, teamId, invited, joined, confirm`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(teamsListMemberships))

teams
    .command(`createMembership`)
    .description(`Invite a new member to join your team. Provide an ID for existing users, or invite unregistered users using an email or phone number. If initiated from a Client SDK, Appwrite will send an email or sms with a link to join the team to the invited user, and an account will be created for them if one doesn't exist. If initiated from a Server SDK, the new member will be added automatically to the team.  You only need to provide one of a user ID, email, or phone number. Appwrite will prioritize accepting the user ID > email > phone number if you provide more than one of these parameters.  Use the 'url' parameter to redirect the user from the invitation email to your app. After the user is redirected, use the [Update Team Membership Status](/docs/client/teams#teamsUpdateMembershipStatus) endpoint to allow the user to accept the invitation to the team.   Please note that to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) Appwrite will accept the only redirect URLs under the domains you have added as a platform on the Appwrite Console. `)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--roles [roles...]`, `Array of strings. Use this param to set the user roles in the team. A role can be any string. Learn more about [roles and permissions](/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
    .option(`--email <email>`, `Email of the new team member.`)
    .option(`--userId <userId>`, `ID of the user to be added to a team.`)
    .option(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--url <url>`, `URL to redirect the user back to your app from the invitation email.  Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--name <name>`, `Name of the new team member. Max length: 128 chars.`)
    .action(actionRunner(teamsCreateMembership))

teams
    .command(`getMembership`)
    .description(`Get a team member by the membership unique id. All team members have read access for this resource.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--membershipId <membershipId>`, `Membership ID.`)
    .action(actionRunner(teamsGetMembership))

teams
    .command(`updateMembership`)
    .description(`Modify the roles of a team member. Only team members with the owner role have access to this endpoint. Learn more about [roles and permissions](/docs/permissions). `)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--membershipId <membershipId>`, `Membership ID.`)
    .requiredOption(`--roles [roles...]`, `An array of strings. Use this param to set the user's roles in the team. A role can be any string. Learn more about [roles and permissions](https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
    .action(actionRunner(teamsUpdateMembership))

teams
    .command(`deleteMembership`)
    .description(`This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--membershipId <membershipId>`, `Membership ID.`)
    .action(actionRunner(teamsDeleteMembership))

teams
    .command(`updateMembershipStatus`)
    .description(`Use this endpoint to allow a user to accept an invitation to join a team after being redirected back to your app from the invitation email received by the user.  If the request is successful, a session for the user is automatically created. `)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--membershipId <membershipId>`, `Membership ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Secret key.`)
    .action(actionRunner(teamsUpdateMembershipStatus))

teams
    .command(`getPrefs`)
    .description(`Get the team's shared preferences by its unique ID. If a preference doesn't need to be shared by all team members, prefer storing them in [user preferences](/docs/client/account#accountGetPrefs).`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .action(actionRunner(teamsGetPrefs))

teams
    .command(`updatePrefs`)
    .description(`Update the team's preferences by its unique ID. The object you pass is stored as is and replaces any previous value. The maximum allowed prefs size is 64kB and throws an error if exceeded.`)
    .requiredOption(`--teamId <teamId>`, `Team ID.`)
    .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
    .action(actionRunner(teamsUpdatePrefs))


module.exports = {
    teams,
    teamsList,
    teamsCreate,
    teamsGet,
    teamsUpdateName,
    teamsDelete,
    teamsListLogs,
    teamsListMemberships,
    teamsCreateMembership,
    teamsGetMembership,
    teamsUpdateMembership,
    teamsDeleteMembership,
    teamsUpdateMembershipStatus,
    teamsGetPrefs,
    teamsUpdatePrefs
};
