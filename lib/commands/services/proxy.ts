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
import {
  Proxy,
  StatusCode,
  ProxyResourceType,
} from "@appwrite.io/console";

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

proxy
  .command(`list-rules`)
  .description(`Get a list of all the proxy rules. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch`)
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
        parse(await (await getProxyClient()).listRules(queries, search, total)),
    ),
  );

proxy
  .command(`create-api-rule`)
  .description(`Create a new proxy rule for serving Appwrite's API on custom domain.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .action(
    actionRunner(
      async ({ domain }) =>
        parse(await (await getProxyClient()).createAPIRule(domain)),
    ),
  );

proxy
  .command(`create-function-rule`)
  .description(`Create a new proxy rule for executing Appwrite Function on custom domain.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--functionid <functionid>`, `ID of function to be executed.`)
  .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
  .action(
    actionRunner(
      async ({ domain, functionId, branch }) =>
        parse(await (await getProxyClient()).createFunctionRule(domain, functionId, branch)),
    ),
  );

proxy
  .command(`create-redirect-rule`)
  .description(`Create a new proxy rule for to redirect from custom domain to another domain.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--url <url>`, `Target URL of redirection`)
  .requiredOption(`--statuscode <statuscode>`, `Status code of redirection`)
  .requiredOption(`--resourceid <resourceid>`, `ID of parent resource.`)
  .requiredOption(`--resourcetype <resourcetype>`, `Type of parent resource.`)
  .action(
    actionRunner(
      async ({ domain, url, statusCode, resourceId, resourceType }) =>
        parse(await (await getProxyClient()).createRedirectRule(domain, url, statusCode as StatusCode, resourceId, resourceType as ProxyResourceType)),
    ),
  );

proxy
  .command(`create-site-rule`)
  .description(`Create a new proxy rule for serving Appwrite Site on custom domain.`)
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--siteid <siteid>`, `ID of site to be executed.`)
  .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
  .action(
    actionRunner(
      async ({ domain, siteId, branch }) =>
        parse(await (await getProxyClient()).createSiteRule(domain, siteId, branch)),
    ),
  );

proxy
  .command(`get-rule`)
  .description(`Get a proxy rule by its unique ID.`)
  .requiredOption(`--ruleid <ruleid>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).getRule(ruleId)),
    ),
  );

proxy
  .command(`delete-rule`)
  .description(`Delete a proxy rule by its unique ID.`)
  .requiredOption(`--ruleid <ruleid>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).deleteRule(ruleId)),
    ),
  );

proxy
  .command(`update-rule-verification`)
  .description(`Retry getting verification process of a proxy rule. This endpoint triggers domain verification by checking DNS records (CNAME) against the configured target domain. If verification is successful, a TLS certificate will be automatically provisioned for the domain.`)
  .requiredOption(`--ruleid <ruleid>`, `Rule ID.`)
  .action(
    actionRunner(
      async ({ ruleId }) =>
        parse(await (await getProxyClient()).updateRuleVerification(ruleId)),
    ),
  );

