import fs from "fs";
import pathLib from "path";
import tar from "tar";
import ignoreModule from "ignore";
const ignore: typeof ignoreModule =
  (ignoreModule as any).default ?? ignoreModule;
import { promisify } from "util";
import Client from "../client.js";
import { getAllFiles, showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject, sdkForConsole } from "../sdks.js";
import {
  parse,
  actionRunner,
  parseInteger,
  parseBool,
  commandDescriptions,
  success,
  log,
  warn,
} from "../parser.js";
import { localConfig, globalConfig } from "../config.js";
import { File } from "undici";
import { ReadableStream } from "stream/web";
import type { UploadProgress, FileInput } from "../types.js";
import { StatusCode, ProxyResourceType } from "@appwrite.io/console";

function convertReadStreamToReadableStream(
  readStream: fs.ReadStream,
): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const proxy = new Command("proxy")
  .description(commandDescriptions["proxy"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

interface ProxyListRulesRequestParams {
  queries?: string[];
  search?: string;
  total?: boolean;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyListRules = async ({
  queries,
  search,
  total,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyListRulesRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules";
  let payload = {};
  if (typeof queries !== "undefined") {
    payload["queries"] = queries;
  }
  if (typeof search !== "undefined") {
    payload["search"] = search;
  }
  if (typeof total !== "undefined") {
    payload["total"] = total;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyCreateAPIRuleRequestParams {
  domain: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyCreateAPIRule = async ({
  domain,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyCreateAPIRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/api";
  let payload = {};
  if (typeof domain !== "undefined") {
    payload["domain"] = domain;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyCreateFunctionRuleRequestParams {
  domain: string;
  functionId: string;
  branch?: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyCreateFunctionRule = async ({
  domain,
  functionId,
  branch,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyCreateFunctionRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/function";
  let payload = {};
  if (typeof domain !== "undefined") {
    payload["domain"] = domain;
  }
  if (typeof functionId !== "undefined") {
    payload["functionId"] = functionId;
  }
  if (typeof branch !== "undefined") {
    payload["branch"] = branch;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyCreateRedirectRuleRequestParams {
  domain: string;
  url: string;
  statusCode: StatusCode;
  resourceId: string;
  resourceType: ProxyResourceType;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyCreateRedirectRule = async ({
  domain,
  url,
  statusCode,
  resourceId,
  resourceType,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyCreateRedirectRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/redirect";
  let payload = {};
  if (typeof domain !== "undefined") {
    payload["domain"] = domain;
  }
  if (typeof url !== "undefined") {
    payload["url"] = url;
  }
  if (typeof statusCode !== "undefined") {
    payload["statusCode"] = statusCode;
  }
  if (typeof resourceId !== "undefined") {
    payload["resourceId"] = resourceId;
  }
  if (typeof resourceType !== "undefined") {
    payload["resourceType"] = resourceType;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyCreateSiteRuleRequestParams {
  domain: string;
  siteId: string;
  branch?: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyCreateSiteRule = async ({
  domain,
  siteId,
  branch,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyCreateSiteRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/site";
  let payload = {};
  if (typeof domain !== "undefined") {
    payload["domain"] = domain;
  }
  if (typeof siteId !== "undefined") {
    payload["siteId"] = siteId;
  }
  if (typeof branch !== "undefined") {
    payload["branch"] = branch;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyGetRuleRequestParams {
  ruleId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyGetRule = async ({
  ruleId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyGetRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/{ruleId}".replace("{ruleId}", ruleId);
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyDeleteRuleRequestParams {
  ruleId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyDeleteRule = async ({
  ruleId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyDeleteRuleRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/{ruleId}".replace("{ruleId}", ruleId);
  let payload = {};

  let response = undefined;

  response = await client.call(
    "delete",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface ProxyUpdateRuleVerificationRequestParams {
  ruleId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const proxyUpdateRuleVerification = async ({
  ruleId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: ProxyUpdateRuleVerificationRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/proxy/rules/{ruleId}/verification".replace(
    "{ruleId}",
    ruleId,
  );
  let payload = {};

  let response = undefined;

  response = await client.call(
    "patch",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
proxy
  .command(`list-rules`)
  .description(
    `Get a list of all the proxy rules. You can use the query params to filter your results.`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch`,
  )
  .option(
    `--search <search>`,
    `Search term to filter your list results. Max length: 256 chars.`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(actionRunner(proxyListRules));

proxy
  .command(`create-api-rule`)
  .description(
    `Create a new proxy rule for serving Appwrite's API on custom domain.`,
  )
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .action(actionRunner(proxyCreateAPIRule));

proxy
  .command(`create-function-rule`)
  .description(
    `Create a new proxy rule for executing Appwrite Function on custom domain.`,
  )
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(
    `--function-id <function-id>`,
    `ID of function to be executed.`,
  )
  .option(
    `--branch <branch>`,
    `Name of VCS branch to deploy changes automatically`,
  )
  .action(actionRunner(proxyCreateFunctionRule));

proxy
  .command(`create-redirect-rule`)
  .description(
    `Create a new proxy rule for to redirect from custom domain to another domain.`,
  )
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--url <url>`, `Target URL of redirection`)
  .requiredOption(`--status-code <status-code>`, `Status code of redirection`)
  .requiredOption(`--resource-id <resource-id>`, `ID of parent resource.`)
  .requiredOption(`--resource-type <resource-type>`, `Type of parent resource.`)
  .action(actionRunner(proxyCreateRedirectRule));

proxy
  .command(`create-site-rule`)
  .description(
    `Create a new proxy rule for serving Appwrite Site on custom domain.`,
  )
  .requiredOption(`--domain <domain>`, `Domain name.`)
  .requiredOption(`--site-id <site-id>`, `ID of site to be executed.`)
  .option(
    `--branch <branch>`,
    `Name of VCS branch to deploy changes automatically`,
  )
  .action(actionRunner(proxyCreateSiteRule));

proxy
  .command(`get-rule`)
  .description(`Get a proxy rule by its unique ID.`)
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(actionRunner(proxyGetRule));

proxy
  .command(`delete-rule`)
  .description(`Delete a proxy rule by its unique ID.`)
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(actionRunner(proxyDeleteRule));

proxy
  .command(`update-rule-verification`)
  .description(
    `Retry getting verification process of a proxy rule. This endpoint triggers domain verification by checking DNS records (CNAME) against the configured target domain. If verification is successful, a TLS certificate will be automatically provisioned for the domain.`,
  )
  .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
  .action(actionRunner(proxyUpdateRuleVerification));
