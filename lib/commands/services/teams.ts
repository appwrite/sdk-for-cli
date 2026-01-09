import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Teams } from "@appwrite.io/console";

let teamsClient: Teams | null = null;

const getTeamsClient = async (): Promise<Teams> => {
  if (!teamsClient) {
    const sdkClient = await sdkForProject();
    teamsClient = new Teams(sdkClient);
  }
  return teamsClient;
};

export const teams = new Command("teams")
  .description(commandDescriptions["teams"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

teams
  .command(`list`)
  .description(`Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, total, billingPlan`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getTeamsClient()).list(queries, search, total)),
    ),
  );

teams
  .command(`create`)
  .description(`Create a new team. The user who creates the team will automatically be assigned as the owner of the team. Only the users with the owner role can invite new members, add new owners and delete or update the team.`)
  .requiredOption(`--team-id <team-id>`, `Team ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Team name. Max length: 128 chars.`)
  .option(`--roles [roles...]`, `Array of strings. Use this param to set the roles in the team for the user who created it. The default role is **owner**. A role can be any string. Learn more about [roles and permissions](https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
  .action(
    actionRunner(
      async ({ teamId, name, roles }) =>
        parse(await (await getTeamsClient()).create(teamId, name, roles)),
    ),
  );

teams
  .command(`get`)
  .description(`Get a team by its ID. All team members have read access for this resource.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ teamId }) =>
        parse(await (await getTeamsClient()).get(teamId)),
    ),
  );

teams
  .command(`update-name`)
  .description(`Update the team's name by its unique ID.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--name <name>`, `New team name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ teamId, name }) =>
        parse(await (await getTeamsClient()).updateName(teamId, name)),
    ),
  );

teams
  .command(`delete`)
  .description(`Delete a team using its ID. Only team members with the owner role can delete the team.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ teamId }) =>
        parse(await (await getTeamsClient()).delete(teamId)),
    ),
  );

teams
  .command(`list-logs`)
  .description(`Get the team activity logs list by its unique ID.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ teamId, queries, total }) =>
        parse(await (await getTeamsClient()).listLogs(teamId, queries, total)),
    ),
  );

teams
  .command(`list-memberships`)
  .description(`Use this endpoint to list a team's members using the team's ID. All team members have read access to this endpoint. Hide sensitive attributes from the response by toggling membership privacy in the Console.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, teamId, invited, joined, confirm, roles`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ teamId, queries, search, total }) =>
        parse(await (await getTeamsClient()).listMemberships(teamId, queries, search, total)),
    ),
  );

teams
  .command(`create-membership`)
  .description(`Invite a new member to join your team. Provide an ID for existing users, or invite unregistered users using an email or phone number. If initiated from a Client SDK, Appwrite will send an email or sms with a link to join the team to the invited user, and an account will be created for them if one doesn't exist. If initiated from a Server SDK, the new member will be added automatically to the team.

You only need to provide one of a user ID, email, or phone number. Appwrite will prioritize accepting the user ID > email > phone number if you provide more than one of these parameters.

Use the \`url\` parameter to redirect the user from the invitation email to your app. After the user is redirected, use the [Update Team Membership Status](https://appwrite.io/docs/references/cloud/client-web/teams#updateMembershipStatus) endpoint to allow the user to accept the invitation to the team. 

Please note that to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) Appwrite will accept the only redirect URLs under the domains you have added as a platform on the Appwrite Console.
`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--roles [roles...]`, `Array of strings. Use this param to set the user roles in the team. A role can be any string. Learn more about [roles and permissions](https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
  .option(`--email <email>`, `Email of the new team member.`)
  .option(`--user-id <user-id>`, `ID of the user to be added to a team.`)
  .option(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--url <url>`, `URL to redirect the user back to your app from the invitation email. This parameter is not required when an API key is supplied. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
  .option(`--name <name>`, `Name of the new team member. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ teamId, roles, email, userId, phone, url, name }) =>
        parse(await (await getTeamsClient()).createMembership(teamId, roles, email, userId, phone, url, name)),
    ),
  );

teams
  .command(`get-membership`)
  .description(`Get a team member by the membership unique id. All team members have read access for this resource. Hide sensitive attributes from the response by toggling membership privacy in the Console.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--membership-id <membership-id>`, `Membership ID.`)
  .action(
    actionRunner(
      async ({ teamId, membershipId }) =>
        parse(await (await getTeamsClient()).getMembership(teamId, membershipId)),
    ),
  );

teams
  .command(`update-membership`)
  .description(`Modify the roles of a team member. Only team members with the owner role have access to this endpoint. Learn more about [roles and permissions](https://appwrite.io/docs/permissions).
`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--membership-id <membership-id>`, `Membership ID.`)
  .requiredOption(`--roles [roles...]`, `An array of strings. Use this param to set the user's roles in the team. A role can be any string. Learn more about [roles and permissions](https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.`)
  .action(
    actionRunner(
      async ({ teamId, membershipId, roles }) =>
        parse(await (await getTeamsClient()).updateMembership(teamId, membershipId, roles)),
    ),
  );

teams
  .command(`delete-membership`)
  .description(`This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--membership-id <membership-id>`, `Membership ID.`)
  .action(
    actionRunner(
      async ({ teamId, membershipId }) =>
        parse(await (await getTeamsClient()).deleteMembership(teamId, membershipId)),
    ),
  );

teams
  .command(`update-membership-status`)
  .description(`Use this endpoint to allow a user to accept an invitation to join a team after being redirected back to your app from the invitation email received by the user.

If the request is successful, a session for the user is automatically created.
`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--membership-id <membership-id>`, `Membership ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--secret <secret>`, `Secret key.`)
  .action(
    actionRunner(
      async ({ teamId, membershipId, userId, secret }) =>
        parse(await (await getTeamsClient()).updateMembershipStatus(teamId, membershipId, userId, secret)),
    ),
  );

teams
  .command(`get-prefs`)
  .description(`Get the team's shared preferences by its unique ID. If a preference doesn't need to be shared by all team members, prefer storing them in [user preferences](https://appwrite.io/docs/references/cloud/client-web/account#getPrefs).`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ teamId }) =>
        parse(await (await getTeamsClient()).getPrefs(teamId)),
    ),
  );

teams
  .command(`update-prefs`)
  .description(`Update the team's preferences by its unique ID. The object you pass is stored as is and replaces any previous value. The maximum allowed prefs size is 64kB and throws an error if exceeded.`)
  .requiredOption(`--team-id <team-id>`, `Team ID.`)
  .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
  .action(
    actionRunner(
      async ({ teamId, prefs }) =>
        parse(await (await getTeamsClient()).updatePrefs(teamId, JSON.parse(prefs))),
    ),
  );

