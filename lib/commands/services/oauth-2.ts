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
import { Oauth2 } from "@appwrite.io/console";

let oauth2Client: Oauth2 | null = null;

const getOauth2Client = async (): Promise<Oauth2> => {
  if (!oauth2Client) {
    const sdkClient = await sdkForProject();
    oauth2Client = new Oauth2(sdkClient);
  }
  return oauth2Client;
};

export const oauth2 = new Command("oauth-2")
  .description(commandDescriptions["oauth2"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const oauth2AuthorizeCommand = oauth2
  .command(`authorize`)
  .description(`Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of \`application/json\` to receive a JSON response instead of a redirect.`)
  .option(`--client-_id <client-_id>`, `OAuth2 client ID.`)
  .option(`--redirect-_uri <redirect-_uri>`, `Redirect URI where visitor will be redirected after authorization, whether successful or not.`)
  .option(`--response-_type <response-_type>`, `OAuth2 / OIDC response type. One of \`code\` (Authorization Code Flow), \`id_token\` (Implicit Flow, OIDC login only), or \`code id_token\` (Hybrid Flow).`)
  .option(`--scope <scope>`, `Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: \`openid\`, \`email\`, \`profile\`, \`phone\`.`)
  .option(`--state <state>`, `OAuth2 state. You receive this back in the redirect URI.`)
  .option(`--nonce <nonce>`, `OIDC nonce parameter to prevent replay attacks. Required when response_type includes \`id_token\`.`)
  .option(`--code-_challenge <code-_challenge>`, `PKCE code challenge. Required when OAuth2 app is public.`)
  .option(`--code-_challenge-_method <code-_challenge-_method>`, `PKCE code challenge method. Required when OAuth2 app is public.`)
  .option(`--prompt <prompt>`, `OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.`)
  .option(`--max-_age <max-_age>`, `OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.`, parseInteger)
  .option(`--authorization-_details <authorization-_details>`, `Rich authorization request. JSON array of objects, each with a \`type\` and project-defined fields`)
  .option(`--resource <resource>`, `RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.`)
  .option(`--request-_uri <request-_uri>`, `OAuth2 authorization request handle returned by the pushed authorization request endpoint.`)
  .action(
    actionRunner(
      async ({ client_id, redirect_uri, response_type, scope, state, nonce, code_challenge, code_challenge_method, prompt, max_age, authorization_details, resource, request_uri }) =>
        parse(await (await getOauth2Client()).authorize(client_id, redirect_uri, response_type, scope, state, nonce, code_challenge, code_challenge_method, prompt, max_age, authorization_details, resource, request_uri)),
    ),
  );


const oauth2CreateDeviceAuthorizationCommand = oauth2
  .command(`create-device-authorization`)
  .description(`Start the OAuth2 Device Authorization Grant. Returns the device code, user code, verification URL, expiration, and polling interval.`)
  .option(`--client-_id <client-_id>`, `OAuth2 client ID.`)
  .option(`--scope <scope>`, `Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: \`openid\`, \`email\`, \`profile\`.`)
  .option(`--authorization-_details <authorization-_details>`, `Rich authorization request. JSON array of objects, each with a \`type\` and project-defined fields`)
  .option(`--resource <resource>`, `RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.`)
  .action(
    actionRunner(
      async ({ client_id, scope, authorization_details, resource }) =>
        parse(await (await getOauth2Client()).createDeviceAuthorization(client_id, scope, authorization_details, resource)),
    ),
  );


const oauth2CreateGrantCommand = oauth2
  .command(`create-grant`)
  .description(`Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.`)
  .requiredOption(`--user-_code <user-_code>`, `User code displayed on the device.`)
  .action(
    actionRunner(
      async ({ user_code }) =>
        parse(await (await getOauth2Client()).createGrant(user_code)),
    ),
  );


const oauth2GetGrantCommand = oauth2
  .command(`get-grant`)
  .description(`Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.`)
  .requiredOption(`--grant-_id <grant-_id>`, `Grant ID made during authorization, provided to consent screen in URL search params.`)
  .action(
    actionRunner(
      async ({ grant_id }) =>
        parse(await (await getOauth2Client()).getGrant(grant_id)),
    ),
  );


const oauth2LogoutCommand = oauth2
  .command(`logout`)
  .description(`OpenID Connect RP-Initiated Logout. Ends the user session and revokes the tokens issued to the app identified by the \`id_token_hint\`, then redirects the user to \`post_logout_redirect_uri\` when it matches a URI registered on the app.`)
  .option(`--id-_token-_hint <id-_token-_hint>`, `ID Token previously issued to the app, used as proof of the logout request. Required to end the session; signature and issuer are validated while expiry is ignored.`)
  .option(`--logout-_hint <logout-_hint>`, `Hint about the user that is logging out. Accepted for OIDC compatibility.`)
  .option(`--client-_id <client-_id>`, `OAuth2 client ID. When both \`client_id\` and \`id_token_hint\` are provided, they must identify the same app.`)
  .option(`--post-_logout-_redirect-_uri <post-_logout-_redirect-_uri>`, `URI to redirect the user to after logout. Must exactly match a URI registered in the app's \`postLogoutRedirectUris\`.`)
  .option(`--state <state>`, `Opaque value passed back unchanged in the \`state\` query param of the post-logout redirect.`)
  .option(`--ui-_locales <ui-_locales>`, `Preferred languages for any logout UI, as space-separated BCP47 tags. Accepted for OIDC compatibility.`)
  .action(
    actionRunner(
      async ({ id_token_hint, logout_hint, client_id, post_logout_redirect_uri, state, ui_locales }) =>
        parse(await (await getOauth2Client()).logout(id_token_hint, logout_hint, client_id, post_logout_redirect_uri, state, ui_locales)),
    ),
  );


const oauth2ListOrganizationsCommand = oauth2
  .command(`list-organizations`)
  .description(`List the organizations the OAuth2 access token can access. Resolves the token's \`organization\` authorization details, expanding the \`*\` wildcard into the concrete set of organizations the user can see.`)
  .option(`--limit <limit>`, `Maximum number of organizations to return. Between 1 and 5000.`, parseInteger)
  .option(`--offset <offset>`, `Number of organizations to skip before returning results. Used for pagination.`, parseInteger)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ limit, offset, search }) =>
        parse(await (await getOauth2Client()).listOrganizations(limit, offset, search)),
    ),
  );


const oauth2CreatePARCommand = oauth2
  .command(`create-par`)
  .description(`Store an OAuth2 authorization request server-side and receive a short-lived request_uri handle for the authorize endpoint.`)
  .requiredOption(`--client-_id <client-_id>`, `OAuth2 client ID.`)
  .requiredOption(`--redirect-_uri <redirect-_uri>`, `Redirect URI where visitor will be redirected after authorization, whether successful or not.`)
  .requiredOption(`--response-_type <response-_type>`, `OAuth2 / OIDC response type.`)
  .requiredOption(`--scope <scope>`, `Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: \`openid\`, \`email\`, \`profile\`, \`phone\`.`)
  .option(`--state <state>`, `OAuth2 state. You receive this back in the redirect URI.`)
  .option(`--nonce <nonce>`, `OIDC nonce parameter to prevent replay attacks. Required when response_type includes \`id_token\`.`)
  .option(`--code-_challenge <code-_challenge>`, `PKCE code challenge. Required when OAuth2 app is public.`)
  .option(`--code-_challenge-_method <code-_challenge-_method>`, `PKCE code challenge method. Required when OAuth2 app is public.`)
  .option(`--prompt <prompt>`, `OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.`)
  .option(`--max-_age <max-_age>`, `OIDC max_age parameter for customization of consent screen.`, parseInteger)
  .option(`--authorization-_details <authorization-_details>`, `Rich authorization request. JSON array of objects, each with a \`type\` and project-defined fields`)
  .option(`--resource <resource>`, `RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.`)
  .action(
    actionRunner(
      async ({ client_id, redirect_uri, response_type, scope, state, nonce, code_challenge, code_challenge_method, prompt, max_age, authorization_details, resource }) =>
        parse(await (await getOauth2Client()).createPAR(client_id, redirect_uri, response_type, scope, state, nonce, code_challenge, code_challenge_method, prompt, max_age, authorization_details, resource)),
    ),
  );


const oauth2ListProjectsCommand = oauth2
  .command(`list-projects`)
  .description(`List the projects the OAuth2 access token can access. Resolves the token's \`project\` authorization details, expanding the \`*\` wildcard into the concrete set of projects the user can see.`)
  .option(`--limit <limit>`, `Maximum number of projects to return. Between 1 and 5000.`, parseInteger)
  .option(`--offset <offset>`, `Number of projects to skip before returning results. Used for pagination.`, parseInteger)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ limit, offset, search }) =>
        parse(await (await getOauth2Client()).listProjects(limit, offset, search)),
    ),
  );


const oauth2RejectCommand = oauth2
  .command(`reject`)
  .description(`Reject an OAuth2 grant when the user denies consent. Returns the \`redirectUrl\` the end user should be sent to with an \`access_denied\` error. You can pass Accept header of \`application/json\` to receive a JSON response instead of a redirect.`)
  .requiredOption(`--grant-_id <grant-_id>`, `Grant ID made during authorization, provided to consent screen in URL search params.`)
  .action(
    actionRunner(
      async ({ grant_id }) =>
        parse(await (await getOauth2Client()).reject(grant_id)),
    ),
  );


const oauth2RevokeCommand = oauth2
  .command(`revoke`)
  .description(`Revoke an OAuth2 access token or refresh token.`)
  .requiredOption(`--token <token>`, `The access or refresh token to revoke.`)
  .option(`--token-_type-_hint <token-_type-_hint>`, `Type of token to revoke (access_token or refresh_token).`)
  .option(`--client-_id <client-_id>`, `OAuth2 client ID.`)
  .option(`--client-_secret <client-_secret>`, `OAuth2 client secret. Required for confidential apps; omitted for public apps.`)
  .action(
    actionRunner(
      async ({ token, token_type_hint, client_id, client_secret }) =>
        parse(await (await getOauth2Client()).revoke(token, token_type_hint, client_id, client_secret)),
    ),
  );


const oauth2CreateTokenCommand = oauth2
  .command(`create-token`)
  .description(`Exchange an OAuth2 authorization code, refresh token, or device code for access and refresh tokens.`)
  .requiredOption(`--grant-_type <grant-_type>`, `OAuth2 grant type. Can be one of: \`authorization_code\`, \`refresh_token\`, \`urn:ietf:params:oauth:grant-type:device_code\`.`)
  .option(`--code <code>`, `Authorization code to be exchanged for access and refresh tokens. Required for \`authorization_code\` grant type.`)
  .option(`--refresh-_token <refresh-_token>`, `Refresh token to be exchanged for a new access and refresh tokens. Required for \`refresh_token\` grant type.`)
  .option(`--device-_code <device-_code>`, `Device code obtained from the device authorization endpoint. Required for \`urn:ietf:params:oauth:grant-type:device_code\` grant type.`)
  .option(`--client-_id <client-_id>`, `OAuth2 client ID.`)
  .option(`--client-_secret <client-_secret>`, `OAuth2 client secret. Required for confidential apps.`)
  .option(`--code-_verifier <code-_verifier>`, `PKCE code verifier. Required for public apps.`)
  .option(`--redirect-_uri <redirect-_uri>`, `Redirect URI. Required for \`authorization_code\` grant type.`)
  .option(`--resource <resource>`, `RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.`)
  .action(
    actionRunner(
      async ({ grant_type, code, refresh_token, device_code, client_id, client_secret, code_verifier, redirect_uri, resource }) =>
        parse(await (await getOauth2Client()).createToken(grant_type, code, refresh_token, device_code, client_id, client_secret, code_verifier, redirect_uri, resource)),
    ),
  );


