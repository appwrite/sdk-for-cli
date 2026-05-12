import { Command } from "commander";
import {
  buildQueries,
  collectQueryValue,
  parseDeprecatedWhereQuery,
  parseFilterQuery,
} from "../utils/query.js";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Proxy } from "@appwrite.io/console";

let proxyClient: Proxy | null = null;

const getProxyClient = async (): Promise<Proxy> => {
  if (!proxyClient) {
    const sdkClient = await sdkForProject();
    proxyClient = new Proxy(sdkClient);
  }
  return proxyClient;
};

export const proxy = new Command("proxy")
  .description(commandDescriptions["proxy"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const proxyListRulesCommand = proxy
  .command(`list-rules`)
  .description(`Get a list of all the proxy rules. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--filter <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseFilterQuery(value), previous))
  .option(`--where <expression>`, `Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseDeprecatedWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getProxyClient()).listRules(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const proxyCreateAPIRuleCommand = proxy
  .command(`create-api-rule`)
  .description(`Create a new proxy rule for serving Appwrite's API on custom domain.

Rule ID is automatically generated as MD5 hash of a rule domain for performance purposes.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .action(
    actionRunner(
      async ({ domain }) =>
        parse(await (await getProxyClient()).createAPIRule(domain)),
    ),
  );


const proxyCreateFunctionRuleCommand = proxy
  .command(`create-function-rule`)
  .description(`Create a new proxy rule for executing Appwrite Function on custom domain.

Rule ID is automatically generated as MD5 hash of a rule domain for performance purposes.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--function-id <function-id>`, `ID of function to be executed.`)
  .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
  .action(
    actionRunner(
      async ({ domain, functionId, branch }) =>
        parse(await (await getProxyClient()).createFunctionRule(domain, functionId, branch)),
    ),
  );


const proxyCreateRedirectRuleCommand = proxy
  .command(`create-redirect-rule`)
  .description(`Create a new proxy rule for to redirect from custom domain to another domain.

Rule ID is automatically generated as MD5 hash of a rule domain for performance purposes.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--url <url>`, `Target URL of redirection`)
  .requiredOption(`--status-code <status-code>`, `Status code of redirection`)
  .requiredOption(`--resource-id <resource-id>`, `ID of parent resource.`)
  .requiredOption(`--resource-type <resource-type>`, `Type of parent resource.`)
  .action(
    actionRunner(
      async ({ domain, url, statusCode, resourceId, resourceType }) =>
        parse(await (await getProxyClient()).createRedirectRule(domain, url, statusCode, resourceId, resourceType)),
    ),
  );


const proxyCreateSiteRuleCommand = proxy
  .command(`create-site-rule`)
  .description(`Create a new proxy rule for serving Appwrite Site on custom domain.

Rule ID is automatically generated as MD5 hash of a rule domain for performance purposes.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--site-id <site-id>`, `ID of site to be executed.`)
  .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
  .action(
    actionRunner(
      async ({ domain, siteId, branch }) =>
        parse(await (await getProxyClient()).createSiteRule(domain, siteId, branch)),
    ),
  );


const proxyGetRuleCommand = proxy
  .command(`get-rule`)
  .description(`Get a proxy rule by its unique ID.`)
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).getRule(ruleId)),
    ),
  );


const proxyDeleteRuleCommand = proxy
  .command(`delete-rule`)
  .description(`Delete a proxy rule by its unique ID.`)
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).deleteRule(ruleId)),
    ),
  );


const proxyUpdateRuleStatusCommand = proxy
  .command(`update-rule-status`)
  .description(`If not succeeded yet, retry verification process of a proxy rule domain. This endpoint triggers domain verification by checking DNS records. If verification is successful, a TLS certificate will be automatically provisioned for the domain asynchronously in the background.`)
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).updateRuleStatus(ruleId)),
    ),
  );


