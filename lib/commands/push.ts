import fs from "fs";
import { parse as parseDotenv } from "dotenv";
import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import ID from "../id.js";
import {
  localConfig,
  globalConfig,
  KeysFunction,
  KeysSite,
  KeysTopics,
  KeysStorage,
  KeysTeams,
  KeysCollection,
  KeysTable,
} from "../config.js";
import { Spinner, SPINNER_DOTS } from "../spinner.js";
import { paginate } from "../paginate.js";
import {
  questionsPushBuckets,
  questionsPushTeams,
  questionsPushFunctions,
  questionsPushSites,
  questionsGetEntrypoint,
  questionsPushCollections,
  questionsPushTables,
  questionsPushMessagingTopics,
  questionsPushResources,
} from "../questions.js";
import {
  cliConfig,
  actionRunner,
  success,
  warn,
  log,
  hint,
  error,
  commandDescriptions,
  drawTable,
} from "../parser.js";
import {
  getProxyService,
  getConsoleService,
  getFunctionsService,
  getSitesService,
  getDatabasesService,
  getTablesDBService,
  getStorageService,
  getMessagingService,
  getTeamsService,
  getProjectsService,
} from "../services.js";
import { ApiService, AuthMethod } from "@appwrite.io/console";
import { checkDeployConditions } from "../utils.js";
import { Pools } from "./utils/pools.js";
import { Attributes, Collection } from "./utils/attributes.js";
import {
  getConfirmation,
  approveChanges,
  getObjectChanges,
} from "./utils/change-approval.js";
import { checkAndApplyTablesDBChanges } from "./utils/database-sync.js";
import type { ConfigType } from "./config.js";

const POLL_DEBOUNCE = 2000; // Milliseconds
const POLL_DEFAULT_VALUE = 30;

interface PushResourcesOptions {
  skipDeprecated?: boolean;
}

interface PushSiteOptions {
  siteId?: string;
  async?: boolean;
  code?: boolean;
  withVariables?: boolean;
}

interface PushFunctionOptions {
  functionId?: string;
  async?: boolean;
  code?: boolean;
  withVariables?: boolean;
}

interface PushTableOptions {
  attempts?: number;
}

export class Push {
  constructor() {}

  public async pushSettings(config: ConfigType): Promise<void> {
    const projectsService = await getProjectsService();
    const projectId = config.projectId;
    const projectName = config.projectName;
    const settings = config.settings ?? {};

    if (projectName) {
      await projectsService.update(projectId, projectName);
    }

    if (settings.services) {
      for (let [service, status] of Object.entries(settings.services)) {
        await projectsService.updateServiceStatus(
          projectId,
          service as ApiService,
          status,
        );
      }
    }

    if (settings.auth) {
      if (settings.auth.security) {
        await projectsService.updateAuthDuration(
          projectId,
          settings.auth.security.duration,
        );
        await projectsService.updateAuthLimit(
          projectId,
          settings.auth.security.limit,
        );
        await projectsService.updateAuthSessionsLimit(
          projectId,
          settings.auth.security.sessionsLimit,
        );
        await projectsService.updateAuthPasswordDictionary(
          projectId,
          settings.auth.security.passwordDictionary,
        );
        await projectsService.updateAuthPasswordHistory(
          projectId,
          settings.auth.security.passwordHistory,
        );
        await projectsService.updatePersonalDataCheck(
          projectId,
          settings.auth.security.personalDataCheck,
        );
        await projectsService.updateSessionAlerts(
          projectId,
          settings.auth.security.sessionAlerts,
        );
        await projectsService.updateMockNumbers(
          projectId,
          settings.auth.security.mockNumbers,
        );
      }

      if (settings.auth.methods) {
        for (let [method, status] of Object.entries(settings.auth.methods)) {
          await projectsService.updateAuthStatus(
            projectId,
            method as AuthMethod,
            status,
          );
        }
      }
    }
  }

  public async pushBucket(bucket: any): Promise<void> {
    const storageService = await getStorageService();

    try {
      await storageService.getBucket(bucket["$id"]);
      await storageService.updateBucket({
        bucketId: bucket["$id"],
        name: bucket.name,
        permissions: bucket["$permissions"],
        fileSecurity: bucket.fileSecurity,
        enabled: bucket.enabled,
        maximumFileSize: bucket.maximumFileSize,
        allowedFileExtensions: bucket.allowedFileExtensions,
        encryption: bucket.encryption,
        antivirus: bucket.antivirus,
        compression: bucket.compression,
      });
    } catch (e: any) {
      if (Number(e.code) === 404) {
        await storageService.createBucket({
          bucketId: bucket["$id"],
          name: bucket.name,
          permissions: bucket["$permissions"],
          fileSecurity: bucket.fileSecurity,
          enabled: bucket.enabled,
          maximumFileSize: bucket.maximumFileSize,
          allowedFileExtensions: bucket.allowedFileExtensions,
          compression: bucket.compression,
          encryption: bucket.encryption,
          antivirus: bucket.antivirus,
        });
      } else {
        throw e;
      }
    }
  }

  public async pushTeam(team: any): Promise<void> {
    const teamsService = await getTeamsService();

    try {
      await teamsService.get(team["$id"]);
      await teamsService.updateName(team["$id"], team.name);
    } catch (e: any) {
      if (Number(e.code) === 404) {
        await teamsService.create(team["$id"], team.name);
      } else {
        throw e;
      }
    }
  }

  public async pushMessagingTopic(topic: any): Promise<void> {
    const messagingService = await getMessagingService();

    try {
      await messagingService.getTopic(topic["$id"]);
      await messagingService.updateTopic(
        topic["$id"],
        topic.name,
        topic.subscribe,
      );
    } catch (e: any) {
      if (Number(e.code) === 404) {
        await messagingService.createTopic(
          topic["$id"],
          topic.name,
          topic.subscribe,
        );
      } else {
        throw e;
      }
    }
  }

  public async pushFunction(
    functions: any[],
    options: {
      async?: boolean;
      code?: boolean;
      withVariables?: boolean;
    } = {},
  ): Promise<{
    successfullyPushed: number;
    successfullyDeployed: number;
    failedDeployments: any[];
    errors: any[];
  }> {
    const { async: asyncDeploy, code, withVariables } = options;

    Spinner.start(false);
    let successfullyPushed = 0;
    let successfullyDeployed = 0;
    const failedDeployments: any[] = [];
    const errors: any[] = [];

    await Promise.all(
      functions.map(async (func: any) => {
        let response: any = {};

        const ignore = func.ignore ? "appwrite.config.json" : ".gitignore";
        let functionExists = false;
        let deploymentCreated = false;

        const updaterRow = new Spinner({
          status: "",
          resource: func.name,
          id: func["$id"],
          end: `Ignoring using: ${ignore}`,
        });

        updaterRow.update({ status: "Getting" }).startSpinner(SPINNER_DOTS);
        const functionsService = await getFunctionsService();
        try {
          response = await functionsService.get({ functionId: func["$id"] });
          functionExists = true;
          if (response.runtime !== func.runtime) {
            updaterRow.fail({
              errorMessage: `Runtime mismatch! (local=${func.runtime},remote=${response.runtime}) Please delete remote function or update your appwrite.config.json`,
            });
            return;
          }

          updaterRow
            .update({ status: "Updating" })
            .replaceSpinner(SPINNER_DOTS);

          response = await functionsService.update({
            functionId: func["$id"],
            name: func.name,
            runtime: func.runtime,
            execute: func.execute,
            events: func.events,
            schedule: func.schedule,
            timeout: func.timeout,
            enabled: func.enabled,
            logging: func.logging,
            entrypoint: func.entrypoint,
            commands: func.commands,
            scopes: func.scopes,
            specification: func.specification,
          });
        } catch (e: any) {
          if (Number(e.code) === 404) {
            functionExists = false;
          } else {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "General error occurs please try again",
            });
            return;
          }
        }

        if (!functionExists) {
          updaterRow
            .update({ status: "Creating" })
            .replaceSpinner(SPINNER_DOTS);

          try {
            response = await functionsService.create({
              functionId: func.$id,
              name: func.name,
              runtime: func.runtime,
              execute: func.execute,
              events: func.events,
              schedule: func.schedule,
              timeout: func.timeout,
              enabled: func.enabled,
              logging: func.logging,
              entrypoint: func.entrypoint,
              commands: func.commands,
              scopes: func.scopes,
              specification: func.specification,
            });

            let domain = "";
            try {
              const consoleService = await getConsoleService();
              const variables = await consoleService.variables();
              domain = ID.unique() + "." + variables["_APP_DOMAIN_FUNCTIONS"];
            } catch (error) {
              console.error("Error fetching console variables.");
              throw error;
            }

            try {
              const proxyService = await getProxyService();
              await proxyService.createFunctionRule(domain, func.$id);
            } catch (error) {
              console.error("Error creating function rule.");
              throw error;
            }

            updaterRow.update({ status: "Created" });
          } catch (e: any) {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "General error occurs please try again",
            });
            return;
          }
        }

        if (withVariables) {
          updaterRow
            .update({ status: "Updating variables" })
            .replaceSpinner(SPINNER_DOTS);

          const functionsService = await getFunctionsService();
          const { variables } = await paginate(
            async (args: any) => {
              return await functionsService.listVariables({
                functionId: args.functionId,
              });
            },
            {
              functionId: func["$id"],
            },
            100,
            "variables",
          );

          await Promise.all(
            variables.map(async (variable: any) => {
              const functionsService = await getFunctionsService();
              await functionsService.deleteVariable({
                functionId: func["$id"],
                variableId: variable["$id"],
              });
            }),
          );

          const envFileLocation = `${func["path"]}/.env`;
          let envVariables: Array<{ key: string; value: string }> = [];
          try {
            if (fs.existsSync(envFileLocation)) {
              const envObject = parseDotenv(
                fs.readFileSync(envFileLocation, "utf8"),
              );
              envVariables = Object.entries(envObject || {}).map(
                ([key, value]) => ({ key, value }),
              );
            }
          } catch (error) {
            envVariables = [];
          }
          await Promise.all(
            envVariables.map(async (variable) => {
              const functionsService = await getFunctionsService();
              await functionsService.createVariable({
                functionId: func["$id"],
                key: variable.key,
                value: variable.value,
                secret: false,
              });
            }),
          );
        }

        if (code === false) {
          successfullyPushed++;
          successfullyDeployed++;
          updaterRow.update({ status: "Pushed" });
          updaterRow.stopSpinner();
          return;
        }

        try {
          updaterRow.update({ status: "Pushing" }).replaceSpinner(SPINNER_DOTS);
          const functionsService = await getFunctionsService();
          response = await functionsService.createDeployment({
            functionId: func["$id"],
            entrypoint: func.entrypoint,
            commands: func.commands,
            code: func.path,
            activate: true,
          });

          updaterRow.update({ status: "Pushed" });
          deploymentCreated = true;
          successfullyPushed++;
        } catch (e: any) {
          errors.push(e);

          switch (e.code) {
            case "ENOENT":
              updaterRow.fail({
                errorMessage: "Not found in the current directory. Skipping...",
              });
              break;
            default:
              updaterRow.fail({
                errorMessage:
                  e.message ?? "An unknown error occurred. Please try again.",
              });
          }
        }

        if (deploymentCreated && !asyncDeploy) {
          try {
            const deploymentId = response["$id"];
            updaterRow.update({
              status: "Deploying",
              end: "Checking deployment status...",
            });

            while (true) {
              const functionsService = await getFunctionsService();
              response = await functionsService.getDeployment({
                functionId: func["$id"],
                deploymentId: deploymentId,
              });

              const status = response["status"];
              if (status === "ready") {
                successfullyDeployed++;

                let url = "";
                const proxyService = await getProxyService();
                const res = await proxyService.listRules([
                  JSON.stringify({ method: "limit", values: [1] }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "deploymentResourceType",
                    values: ["function"],
                  }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "deploymentResourceId",
                    values: [func["$id"]],
                  }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "trigger",
                    values: ["manual"],
                  }),
                ]);

                if (Number(res.total) === 1) {
                  url = res.rules[0].domain;
                }

                updaterRow.update({ status: "Deployed", end: url });

                break;
              } else if (status === "failed") {
                failedDeployments.push({
                  name: func["name"],
                  $id: func["$id"],
                  deployment: response["$id"],
                });
                updaterRow.fail({ errorMessage: `Failed to deploy` });

                break;
              } else {
                updaterRow.update({
                  status: "Deploying",
                  end: `Current status: ${status}`,
                });
              }

              await new Promise((resolve) =>
                setTimeout(resolve, POLL_DEBOUNCE * 1.5),
              );
            }
          } catch (e: any) {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "Unknown error occurred. Please try again",
            });
          }
        }

        updaterRow.stopSpinner();
      }),
    );

    Spinner.stop();

    return {
      successfullyPushed,
      successfullyDeployed,
      failedDeployments,
      errors,
    };
  }

  public async pushSite(
    sites: any[],
    options: {
      async?: boolean;
      code?: boolean;
      withVariables?: boolean;
    } = {},
  ): Promise<{
    successfullyPushed: number;
    successfullyDeployed: number;
    failedDeployments: any[];
    errors: any[];
  }> {
    const { async: asyncDeploy, code, withVariables } = options;

    Spinner.start(false);
    let successfullyPushed = 0;
    let successfullyDeployed = 0;
    const failedDeployments: any[] = [];
    const errors: any[] = [];

    await Promise.all(
      sites.map(async (site: any) => {
        let response: any = {};

        const ignore = site.ignore ? "appwrite.config.json" : ".gitignore";
        let siteExists = false;
        let deploymentCreated = false;

        const updaterRow = new Spinner({
          status: "",
          resource: site.name,
          id: site["$id"],
          end: `Ignoring using: ${ignore}`,
        });

        updaterRow.update({ status: "Getting" }).startSpinner(SPINNER_DOTS);

        const sitesService = await getSitesService();
        try {
          response = await sitesService.get({ siteId: site["$id"] });
          siteExists = true;
          if (response.framework !== site.framework) {
            updaterRow.fail({
              errorMessage: `Framework mismatch! (local=${site.framework},remote=${response.framework}) Please delete remote site or update your appwrite.config.json`,
            });
            return;
          }

          updaterRow
            .update({ status: "Updating" })
            .replaceSpinner(SPINNER_DOTS);

          response = await sitesService.update({
            siteId: site["$id"],
            name: site.name,
            framework: site.framework,
            enabled: site.enabled,
            logging: site.logging,
            timeout: site.timeout,
            installCommand: site.installCommand,
            buildCommand: site.buildCommand,
            outputDirectory: site.outputDirectory,
            buildRuntime: site.buildRuntime,
            adapter: site.adapter,
            specification: site.specification,
          });
        } catch (e: any) {
          if (Number(e.code) === 404) {
            siteExists = false;
          } else {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "General error occurs please try again",
            });
            return;
          }
        }

        if (!siteExists) {
          updaterRow
            .update({ status: "Creating" })
            .replaceSpinner(SPINNER_DOTS);

          try {
            response = await sitesService.create({
              siteId: site.$id,
              name: site.name,
              framework: site.framework,
              enabled: site.enabled,
              logging: site.logging,
              timeout: site.timeout,
              installCommand: site.installCommand,
              buildCommand: site.buildCommand,
              outputDirectory: site.outputDirectory,
              buildRuntime: site.buildRuntime,
              adapter: site.adapter,
              specification: site.specification,
            });

            let domain = "";
            try {
              const consoleService = await getConsoleService();
              const variables = await consoleService.variables();
              domain = ID.unique() + "." + variables["_APP_DOMAIN_SITES"];
            } catch (error) {
              console.error("Error fetching console variables.");
              throw error;
            }

            try {
              const proxyService = await getProxyService();
              await proxyService.createSiteRule(domain, site.$id);
            } catch (error) {
              console.error("Error creating site rule.");
              throw error;
            }

            updaterRow.update({ status: "Created" });
          } catch (e: any) {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "General error occurs please try again",
            });
            return;
          }
        }

        if (withVariables) {
          updaterRow
            .update({ status: "Creating variables" })
            .replaceSpinner(SPINNER_DOTS);

          const sitesService = await getSitesService();
          const { variables } = await paginate(
            async (args: any) => {
              return await sitesService.listVariables({ siteId: args.siteId });
            },
            {
              siteId: site["$id"],
            },
            100,
            "variables",
          );

          await Promise.all(
            variables.map(async (variable: any) => {
              const sitesService = await getSitesService();
              await sitesService.deleteVariable({
                siteId: site["$id"],
                variableId: variable["$id"],
              });
            }),
          );

          const envFileLocation = `${site["path"]}/.env`;
          let envVariables: Array<{ key: string; value: string }> = [];
          try {
            if (fs.existsSync(envFileLocation)) {
              const envObject = parseDotenv(
                fs.readFileSync(envFileLocation, "utf8"),
              );
              envVariables = Object.entries(envObject || {}).map(
                ([key, value]) => ({ key, value }),
              );
            }
          } catch (error) {
            envVariables = [];
          }
          await Promise.all(
            envVariables.map(async (variable) => {
              const sitesService = await getSitesService();
              await sitesService.createVariable({
                siteId: site["$id"],
                key: variable.key,
                value: variable.value,
                secret: false,
              });
            }),
          );
        }

        if (code === false) {
          successfullyPushed++;
          successfullyDeployed++;
          updaterRow.update({ status: "Pushed" });
          updaterRow.stopSpinner();
          return;
        }

        try {
          updaterRow.update({ status: "Pushing" }).replaceSpinner(SPINNER_DOTS);
          const sitesService = await getSitesService();
          response = await sitesService.createDeployment({
            siteId: site["$id"],
            installCommand: site.installCommand,
            buildCommand: site.buildCommand,
            outputDirectory: site.outputDirectory,
            code: site.path,
            activate: true,
          });

          updaterRow.update({ status: "Pushed" });
          deploymentCreated = true;
          successfullyPushed++;
        } catch (e: any) {
          errors.push(e);

          switch (e.code) {
            case "ENOENT":
              updaterRow.fail({
                errorMessage: "Not found in the current directory. Skipping...",
              });
              break;
            default:
              updaterRow.fail({
                errorMessage:
                  e.message ?? "An unknown error occurred. Please try again.",
              });
          }
        }

        if (deploymentCreated && !asyncDeploy) {
          try {
            const deploymentId = response["$id"];
            updaterRow.update({
              status: "Deploying",
              end: "Checking deployment status...",
            });

            while (true) {
              const sitesService = await getSitesService();
              response = await sitesService.getDeployment({
                siteId: site["$id"],
                deploymentId: deploymentId,
              });

              const status = response["status"];
              if (status === "ready") {
                successfullyDeployed++;

                let url = "";
                const proxyService = await getProxyService();
                const res = await proxyService.listRules([
                  JSON.stringify({ method: "limit", values: [1] }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "deploymentResourceType",
                    values: ["site"],
                  }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "deploymentResourceId",
                    values: [site["$id"]],
                  }),
                  JSON.stringify({
                    method: "equal",
                    attribute: "trigger",
                    values: ["manual"],
                  }),
                ]);

                if (Number(res.total) === 1) {
                  url = res.rules[0].domain;
                }

                updaterRow.update({ status: "Deployed", end: url });

                break;
              } else if (status === "failed") {
                failedDeployments.push({
                  name: site["name"],
                  $id: site["$id"],
                  deployment: response["$id"],
                });
                updaterRow.fail({ errorMessage: `Failed to deploy` });

                break;
              } else {
                updaterRow.update({
                  status: "Deploying",
                  end: `Current status: ${status}`,
                });
              }

              await new Promise((resolve) =>
                setTimeout(resolve, POLL_DEBOUNCE * 1.5),
              );
            }
          } catch (e: any) {
            errors.push(e);
            updaterRow.fail({
              errorMessage:
                e.message ?? "Unknown error occurred. Please try again",
            });
          }
        }

        updaterRow.stopSpinner();
      }),
    );

    Spinner.stop();

    return {
      successfullyPushed,
      successfullyDeployed,
      failedDeployments,
      errors,
    };
  }

  public async getDeploymentStatus(
    resourceId: string,
    deploymentId: string,
    resourceType: "function" | "site",
  ): Promise<{
    status: string;
    url?: string;
  }> {
    if (resourceType === "function") {
      const functionsService = await getFunctionsService();
      const response = await functionsService.getDeployment({
        functionId: resourceId,
        deploymentId: deploymentId,
      });

      const status = response["status"];
      let url = "";

      if (status === "ready") {
        const proxyService = await getProxyService();
        const res = await proxyService.listRules([
          JSON.stringify({ method: "limit", values: [1] }),
          JSON.stringify({
            method: "equal",
            attribute: "deploymentResourceType",
            values: ["function"],
          }),
          JSON.stringify({
            method: "equal",
            attribute: "deploymentResourceId",
            values: [resourceId],
          }),
          JSON.stringify({
            method: "equal",
            attribute: "trigger",
            values: ["manual"],
          }),
        ]);

        if (Number(res.total) === 1) {
          url = res.rules[0].domain;
        }
      }

      return { status, url };
    } else {
      const sitesService = await getSitesService();
      const response = await sitesService.getDeployment({
        siteId: resourceId,
        deploymentId: deploymentId,
      });

      const status = response["status"];
      let url = "";

      if (status === "ready") {
        const proxyService = await getProxyService();
        const res = await proxyService.listRules([
          JSON.stringify({ method: "limit", values: [1] }),
          JSON.stringify({
            method: "equal",
            attribute: "deploymentResourceType",
            values: ["site"],
          }),
          JSON.stringify({
            method: "equal",
            attribute: "deploymentResourceId",
            values: [resourceId],
          }),
          JSON.stringify({
            method: "equal",
            attribute: "trigger",
            values: ["manual"],
          }),
        ]);

        if (Number(res.total) === 1) {
          url = res.rules[0].domain;
        }
      }

      return { status, url };
    }
  }
}

async function createPushInstance(): Promise<Push> {
  return new Push();
}

const pushResources = async ({
  skipDeprecated = false,
}: PushResourcesOptions = {}): Promise<void> => {
  const actions: Record<string, (options?: any) => Promise<void>> = {
    settings: pushSettings,
    functions: pushFunction,
    sites: pushSite,
    collections: pushCollection,
    tables: pushTable,
    buckets: pushBucket,
    teams: pushTeam,
    messages: pushMessagingTopic,
  };

  if (skipDeprecated) {
    delete actions.collections;
  }

  if (cliConfig.all) {
    for (let action of Object.values(actions)) {
      await action();
    }
  } else {
    const answers = await inquirer.prompt(questionsPushResources);

    const action = actions[answers.resource];
    if (action !== undefined) {
      await action();
    }
  }
};

const pushSettings = async (): Promise<void> => {
  checkDeployConditions(localConfig);

  try {
    const projectsService = await getProjectsService();
    let response = await projectsService.get(
      localConfig.getProject().projectId,
    );

    const remoteSettings = localConfig.createSettingsObject(response ?? {});
    const localSettings = localConfig.getProject().projectSettings ?? {};

    log("Checking for changes ...");
    const changes: any[] = [];

    changes.push(
      ...getObjectChanges(remoteSettings, localSettings, "services", "Service"),
    );
    changes.push(
      ...getObjectChanges(
        remoteSettings["auth"] ?? {},
        localSettings["auth"] ?? {},
        "methods",
        "Auth method",
      ),
    );
    changes.push(
      ...getObjectChanges(
        remoteSettings["auth"] ?? {},
        localSettings["auth"] ?? {},
        "security",
        "Auth security",
      ),
    );

    if (changes.length > 0) {
      drawTable(changes);
      if ((await getConfirmation()) !== true) {
        success(`Successfully pushed 0 project settings.`);
        return;
      }
    }
  } catch (e) {}

  try {
    log("Pushing project settings ...");

    const pushInstance = await createPushInstance();
    const config = localConfig.getProject();
    const settings = config.projectSettings ?? {};

    if (config.projectName) {
      log("Applying project name ...");
    }

    if (settings.services) {
      log("Applying service statuses ...");
    }

    if (settings.auth) {
      if (settings.auth.security) {
        log("Applying auth security settings ...");
      }

      if (settings.auth.methods) {
        log("Applying auth methods statuses ...");
      }
    }

    await pushInstance.pushSettings({
      projectId: config.projectId,
      projectName: config.projectName,
      settings: config.projectSettings,
    });

    success(`Successfully pushed ${chalk.bold("all")} project settings.`);
  } catch (e) {
    throw e;
  }
};

const pushSite = async ({
  siteId,
  async: asyncDeploy,
  code,
  withVariables,
}: PushSiteOptions = {}): Promise<void> => {
  process.chdir(localConfig.configDirectoryPath);

  const siteIds: string[] = [];

  if (siteId) {
    siteIds.push(siteId);
  } else if (cliConfig.all) {
    checkDeployConditions(localConfig);
    const sites = localConfig.getSites();
    siteIds.push(
      ...sites.map((site: any) => {
        return site.$id;
      }),
    );
  }

  if (siteIds.length <= 0) {
    const answers = await inquirer.prompt(questionsPushSites);
    if (answers.sites) {
      siteIds.push(...answers.sites);
    }
  }

  if (siteIds.length === 0) {
    log("No sites found.");
    hint(
      "Use 'appwrite pull sites' to synchronize existing one, or use 'appwrite init site' to create a new one.",
    );
    return;
  }

  let sites = siteIds.map((id: string) => {
    const sites = localConfig.getSites();
    const site = sites.find((s: any) => s.$id === id);

    if (!site) {
      throw new Error("Site '" + id + "' not found.");
    }

    return site;
  });

  log("Validating sites ...");
  // Validation is done BEFORE pushing so the deployment process can be run in async with progress update
  for (let site of sites) {
    if (!site.buildCommand) {
      log(`Site ${site.name} is missing build command.`);
      const answers = await inquirer.prompt(questionsGetEntrypoint);
      site.buildCommand = answers.entrypoint;
      localConfig.addSite(site);
    }
  }

  if (
    !(await approveChanges(
      sites,
      async (args: any) => {
        const sitesService = await getSitesService();
        return await sitesService.get({ siteId: args.siteId });
      },
      KeysSite,
      "siteId",
      "sites",
      ["vars"],
    ))
  ) {
    return;
  }

  log("Pushing sites ...");

  const pushInstance = await createPushInstance();
  const result = await pushInstance.pushSite(sites, {
    async: asyncDeploy,
    code,
    withVariables,
  });

  const {
    successfullyPushed,
    successfullyDeployed,
    failedDeployments,
    errors,
  } = result;

  failedDeployments.forEach((failed) => {
    const { name, deployment, $id } = failed;
    const failUrl = `${globalConfig.getEndpoint().slice(0, -3)}/console/project-${localConfig.getProject().projectId}/sites/site-${$id}/deployments/deployment-${deployment}`;

    error(
      `Deployment of ${name} has failed. Check at ${failUrl} for more details\n`,
    );
  });

  if (!asyncDeploy) {
    if (successfullyPushed === 0) {
      error("No sites were pushed.");
    } else if (successfullyDeployed !== successfullyPushed) {
      warn(
        `Successfully pushed ${successfullyDeployed} of ${successfullyPushed} sites`,
      );
    } else {
      success(`Successfully pushed ${successfullyPushed} sites.`);
    }
  } else {
    success(`Successfully pushed ${successfullyPushed} sites.`);
  }

  if (cliConfig.verbose) {
    errors.forEach((e) => {
      console.error(e);
    });
  }
};

const pushFunction = async ({
  functionId,
  async: asyncDeploy,
  code,
  withVariables,
}: PushFunctionOptions = {}): Promise<void> => {
  process.chdir(localConfig.configDirectoryPath);

  const functionIds: string[] = [];

  if (functionId) {
    functionIds.push(functionId);
  } else if (cliConfig.all) {
    checkDeployConditions(localConfig);
    const functions = localConfig.getFunctions();
    functionIds.push(
      ...functions.map((func: any) => {
        return func.$id;
      }),
    );
  }

  if (functionIds.length <= 0) {
    const answers = await inquirer.prompt(questionsPushFunctions);
    if (answers.functions) {
      functionIds.push(...answers.functions);
    }
  }

  if (functionIds.length === 0) {
    log("No functions found.");
    hint(
      "Use 'appwrite pull functions' to synchronize existing one, or use 'appwrite init function' to create a new one.",
    );
    return;
  }

  let functions = functionIds.map((id: string) => {
    const functions = localConfig.getFunctions();
    const func = functions.find((f: any) => f.$id === id);

    if (!func) {
      throw new Error("Function '" + id + "' not found.");
    }

    return func;
  });

  log("Validating functions ...");
  for (let func of functions) {
    if (!func.entrypoint) {
      log(`Function ${func.name} is missing an entrypoint.`);
      const answers = await inquirer.prompt(questionsGetEntrypoint);
      func.entrypoint = answers.entrypoint;
      localConfig.addFunction(func);
    }
  }

  if (
    !(await approveChanges(
      functions,
      async (args: any) => {
        const functionsService = await getFunctionsService();
        return await functionsService.get({ functionId: args.functionId });
      },
      KeysFunction,
      "functionId",
      "functions",
      ["vars"],
    ))
  ) {
    return;
  }

  log("Pushing functions ...");

  const pushInstance = await createPushInstance();
  const result = await pushInstance.pushFunction(functions, {
    async: asyncDeploy,
    code,
    withVariables,
  });

  const {
    successfullyPushed,
    successfullyDeployed,
    failedDeployments,
    errors,
  } = result;

  failedDeployments.forEach((failed) => {
    const { name, deployment, $id } = failed;
    const failUrl = `${globalConfig.getEndpoint().slice(0, -3)}/console/project-${localConfig.getProject().projectId}/functions/function-${$id}/deployment-${deployment}`;

    error(
      `Deployment of ${name} has failed. Check at ${failUrl} for more details\n`,
    );
  });

  if (!asyncDeploy) {
    if (successfullyPushed === 0) {
      error("No functions were pushed.");
    } else if (successfullyDeployed !== successfullyPushed) {
      warn(
        `Successfully pushed ${successfullyDeployed} of ${successfullyPushed} functions`,
      );
    } else {
      success(`Successfully pushed ${successfullyPushed} functions.`);
    }
  } else {
    success(`Successfully pushed ${successfullyPushed} functions.`);
  }

  if (cliConfig.verbose) {
    errors.forEach((e) => {
      console.error(e);
    });
  }
};

const pushTable = async ({
  attempts,
}: PushTableOptions = {}): Promise<void> => {
  const tables: any[] = [];

  const pollMaxDebounces = attempts ?? POLL_DEFAULT_VALUE;
  const pools = new Pools(pollMaxDebounces);
  const attributes = new Attributes(pools);

  const { resyncNeeded } = await checkAndApplyTablesDBChanges();
  if (resyncNeeded) {
    log("Resyncing configuration due to tablesDB deletions ...");

    const remoteTablesDBs = (
      await paginate(
        async (args: any) => {
          const tablesDBService = await getTablesDBService();
          return await tablesDBService.list(args.queries || []);
        },
        {},
        100,
        "databases",
      )
    ).databases;
    const localTablesDBs = localConfig.getTablesDBs();

    const remoteDatabaseIds = new Set(remoteTablesDBs.map((db: any) => db.$id));
    const localTables = localConfig.getTables();
    const validTables = localTables.filter((table: any) =>
      remoteDatabaseIds.has(table.databaseId),
    );

    localConfig.set("tables", validTables);

    const validTablesDBs = localTablesDBs.filter((db: any) =>
      remoteDatabaseIds.has(db.$id),
    );
    localConfig.set("tablesDB", validTablesDBs);

    success("Configuration resynced successfully.");
    console.log();
  }

  log("Checking for deleted tables ...");
  const localTablesDBs = localConfig.getTablesDBs();
  const localTables = localConfig.getTables();
  const tablesToDelete: any[] = [];

  for (const db of localTablesDBs) {
    try {
      const { tables: remoteTables } = await paginate(
        async (args: any) => {
          const tablesDBService = await getTablesDBService();
          return await tablesDBService.listTables(
            args.databaseId,
            args.queries || [],
          );
        },
        {
          databaseId: db.$id,
        },
        100,
        "tables",
      );

      for (const remoteTable of remoteTables) {
        const localTable = localTables.find(
          (t: any) => t.$id === remoteTable.$id && t.databaseId === db.$id,
        );
        if (!localTable) {
          tablesToDelete.push({
            ...remoteTable,
            databaseId: db.$id,
            databaseName: db.name,
          });
        }
      }
    } catch (e) {
      // Skip if database doesn't exist or other errors
    }
  }

  if (tablesToDelete.length > 0) {
    log("Found tables that exist remotely but not locally:");
    const deletionChanges = tablesToDelete.map((table: any) => ({
      id: table.$id,
      action: chalk.red("deleting"),
      key: "Table",
      database: table.databaseName,
      remote: table.name,
      local: "(deleted locally)",
    }));
    drawTable(deletionChanges);

    if ((await getConfirmation()) === true) {
      for (const table of tablesToDelete) {
        try {
          log(
            `Deleting table ${table.name} ( ${table.$id} ) from database ${table.databaseName} ...`,
          );
          const tablesDBService = await getTablesDBService();
          await tablesDBService.deleteTable(table.databaseId, table.$id);
          success(`Deleted ${table.name} ( ${table.$id} )`);
        } catch (e: any) {
          error(
            `Failed to delete table ${table.name} ( ${table.$id} ): ${e.message}`,
          );
        }
      }
    }
  }

  if (cliConfig.all) {
    checkDeployConditions(localConfig);
    tables.push(...localConfig.getTables());
  } else {
    const answers = await inquirer.prompt(questionsPushTables);
    if (answers.tables) {
      const configTables = new Map();
      localConfig.getTables().forEach((c: any) => {
        configTables.set(`${c["databaseId"]}|${c["$id"]}`, c);
      });
      answers.tables.forEach((a: any) => {
        const table = configTables.get(a);
        tables.push(table);
      });
    }
  }

  if (tables.length === 0) {
    log("No tables found.");
    hint(
      "Use 'appwrite pull tables' to synchronize existing one, or use 'appwrite init table' to create a new one.",
    );
    return;
  }

  if (
    !(await approveChanges(
      tables,
      async (args: any) => {
        const tablesDBService = await getTablesDBService();
        return await tablesDBService.getTable(args.databaseId, args.tableId);
      },
      KeysTable,
      "tableId",
      "tables",
      ["columns", "indexes"],
      "databaseId",
      "databaseId",
    ))
  ) {
    return;
  }
  let tablesChanged = new Set();

  // Parallel tables actions
  await Promise.all(
    tables.map(async (table: any) => {
      try {
        const tablesDBService = await getTablesDBService();
        const remoteTable = await tablesDBService.getTable(
          table["databaseId"],
          table["$id"],
        );

        const changes: string[] = [];
        if (remoteTable.name !== table.name) changes.push("name");
        if (remoteTable.rowSecurity !== table.rowSecurity)
          changes.push("rowSecurity");
        if (remoteTable.enabled !== table.enabled) changes.push("enabled");
        if (
          JSON.stringify(remoteTable["$permissions"]) !==
          JSON.stringify(table["$permissions"])
        )
          changes.push("permissions");

        if (changes.length > 0) {
          await tablesDBService.updateTable(
            table["databaseId"],
            table["$id"],
            table.name,
            table.rowSecurity,
            table["$permissions"],
          );

          success(
            `Updated ${table.name} ( ${table["$id"]} ) - ${changes.join(", ")}`,
          );
          tablesChanged.add(table["$id"]);
        }
        table.remoteVersion = remoteTable;

        table.isExisted = true;
      } catch (e: any) {
        if (Number(e.code) === 404) {
          log(
            `Table ${table.name} does not exist in the project. Creating ... `,
          );
          const tablesDBService = await getTablesDBService();
          await tablesDBService.createTable(
            table["databaseId"],
            table["$id"],
            table.name,
            table.rowSecurity,
            table["$permissions"],
          );

          success(`Created ${table.name} ( ${table["$id"]} )`);
          tablesChanged.add(table["$id"]);
        } else {
          throw e;
        }
      }
    }),
  );

  // Serialize attribute actions
  for (let table of tables) {
    let columns = table.columns;
    let indexes = table.indexes;

    if (table.isExisted) {
      columns = await attributes.attributesToCreate(
        table.remoteVersion.columns,
        table.columns,
        table as Collection,
      );
      indexes = await attributes.attributesToCreate(
        table.remoteVersion.indexes,
        table.indexes,
        table as Collection,
        true,
      );

      if (
        Array.isArray(columns) &&
        columns.length <= 0 &&
        Array.isArray(indexes) &&
        indexes.length <= 0
      ) {
        continue;
      }
    }

    log(
      `Pushing table ${table.name} ( ${table["databaseId"]} - ${table["$id"]} ) attributes`,
    );

    try {
      await attributes.createColumns(columns, table as Collection);
    } catch (e) {
      throw e;
    }

    try {
      await attributes.createIndexes(indexes, table as Collection);
    } catch (e) {
      throw e;
    }
    tablesChanged.add(table["$id"]);
    success(`Successfully pushed ${table.name} ( ${table["$id"]} )`);
  }

  success(`Successfully pushed ${tablesChanged.size} tables`);
};

const pushCollection = async ({
  attempts,
}: PushTableOptions = {}): Promise<void> => {
  warn(
    "appwrite push collection has been deprecated. Please consider using 'appwrite push tables' instead",
  );
  const collections: any[] = [];

  // Create fresh instances per operation to avoid shared state issues
  const pools = new Pools(attempts ?? POLL_DEFAULT_VALUE);
  const attributes = new Attributes(pools);

  if (cliConfig.all) {
    checkDeployConditions(localConfig);
    collections.push(...localConfig.getCollections());
  } else {
    const answers = await inquirer.prompt(questionsPushCollections);
    if (answers.collections) {
      const configCollections = new Map();
      localConfig.getCollections().forEach((c: any) => {
        configCollections.set(`${c["databaseId"]}|${c["$id"]}`, c);
      });
      answers.collections.forEach((a: any) => {
        const collection = configCollections.get(a);
        collections.push(collection);
      });
    }
  }

  if (collections.length === 0) {
    log("No collections found.");
    hint(
      "Use 'appwrite pull collections' to synchronize existing one, or use 'appwrite init collection' to create a new one.",
    );
    return;
  }

  const databases = Array.from(
    new Set(collections.map((collection: any) => collection["databaseId"])),
  );

  // Parallel db actions
  await Promise.all(
    databases.map(async (databaseId: any) => {
      const localDatabase = localConfig.getDatabase(databaseId);

      const databasesService = await getDatabasesService();
      try {
        const database = await databasesService.get(databaseId);

        if (database.name !== (localDatabase.name ?? databaseId)) {
          await databasesService.update(
            databaseId,
            localDatabase.name ?? databaseId,
          );

          success(`Updated ${localDatabase.name} ( ${databaseId} ) name`);
        }
      } catch (err) {
        log(`Database ${databaseId} not found. Creating it now ...`);

        await databasesService.create(
          databaseId,
          localDatabase.name ?? databaseId,
        );
      }
    }),
  );

  if (
    !(await approveChanges(
      collections,
      async (args: any) => {
        const databasesService = await getDatabasesService();
        return await databasesService.getCollection(
          args.databaseId,
          args.collectionId,
        );
      },
      KeysCollection,
      "collectionId",
      "collections",
      ["attributes", "indexes"],
      "databaseId",
      "databaseId",
    ))
  ) {
    return;
  }
  // Parallel collection actions
  await Promise.all(
    collections.map(async (collection: any) => {
      try {
        const databasesService = await getDatabasesService();
        const remoteCollection = await databasesService.getCollection(
          collection["databaseId"],
          collection["$id"],
        );

        if (remoteCollection.name !== collection.name) {
          await databasesService.updateCollection(
            collection["databaseId"],
            collection["$id"],
            collection.name,
          );

          success(`Updated ${collection.name} ( ${collection["$id"]} ) name`);
        }
        collection.remoteVersion = remoteCollection;

        collection.isExisted = true;
      } catch (e: any) {
        if (Number(e.code) === 404) {
          log(
            `Collection ${collection.name} does not exist in the project. Creating ... `,
          );
          const databasesService = await getDatabasesService();
          await databasesService.createCollection(
            collection["databaseId"],
            collection["$id"],
            collection.name,
            collection.documentSecurity,
            collection["$permissions"],
          );
        } else {
          throw e;
        }
      }
    }),
  );
  let numberOfCollections = 0;
  // Serialize attribute actions
  for (let collection of collections) {
    let collectionAttributes = collection.attributes;
    let indexes = collection.indexes;

    if (collection.isExisted) {
      collectionAttributes = await attributes.attributesToCreate(
        collection.remoteVersion.attributes,
        collection.attributes,
        collection as Collection,
      );
      indexes = await attributes.attributesToCreate(
        collection.remoteVersion.indexes,
        collection.indexes,
        collection as Collection,
        true,
      );

      if (
        Array.isArray(collectionAttributes) &&
        collectionAttributes.length <= 0 &&
        Array.isArray(indexes) &&
        indexes.length <= 0
      ) {
        continue;
      }
    }

    log(
      `Pushing collection ${collection.name} ( ${collection["databaseId"]} - ${collection["$id"]} ) attributes`,
    );

    try {
      await attributes.createAttributes(
        collectionAttributes,
        collection as Collection,
      );
    } catch (e) {
      throw e;
    }

    try {
      await attributes.createIndexes(indexes, collection as Collection);
    } catch (e) {
      throw e;
    }
    numberOfCollections++;
    success(`Successfully pushed ${collection.name} ( ${collection["$id"]} )`);
  }

  success(`Successfully pushed ${numberOfCollections} collections`);
};

const pushBucket = async (): Promise<void> => {
  let bucketIds: string[] = [];
  const configBuckets = localConfig.getBuckets();

  if (cliConfig.all) {
    checkDeployConditions(localConfig);
    bucketIds.push(...configBuckets.map((b: any) => b.$id));
  }

  if (bucketIds.length === 0) {
    const answers = await inquirer.prompt(questionsPushBuckets);
    if (answers.buckets) {
      bucketIds.push(...answers.buckets);
    }
  }

  if (bucketIds.length === 0) {
    log("No buckets found.");
    hint(
      "Use 'appwrite pull buckets' to synchronize existing one, or use 'appwrite init bucket' to create a new one.",
    );
    return;
  }

  let buckets: any[] = [];

  for (const bucketId of bucketIds) {
    const idBuckets = configBuckets.filter((b: any) => b.$id === bucketId);
    buckets.push(...idBuckets);
  }

  if (
    !(await approveChanges(
      buckets,
      async (args: any) => {
        const storageService = await getStorageService();
        return await storageService.getBucket(args.bucketId);
      },
      KeysStorage,
      "bucketId",
      "buckets",
    ))
  ) {
    return;
  }

  log("Pushing buckets ...");

  const pushInstance = await createPushInstance();

  for (let bucket of buckets) {
    log(`Pushing bucket ${chalk.bold(bucket["name"])} ...`);
    await pushInstance.pushBucket(bucket);
  }

  success(`Successfully pushed ${buckets.length} buckets.`);
};

const pushTeam = async (): Promise<void> => {
  let teamIds: string[] = [];
  const configTeams = localConfig.getTeams();

  if (cliConfig.all) {
    checkDeployConditions(localConfig);
    teamIds.push(...configTeams.map((t: any) => t.$id));
  }

  if (teamIds.length === 0) {
    const answers = await inquirer.prompt(questionsPushTeams);
    if (answers.teams) {
      teamIds.push(...answers.teams);
    }
  }

  if (teamIds.length === 0) {
    log("No teams found.");
    hint(
      "Use 'appwrite pull teams' to synchronize existing one, or use 'appwrite init team' to create a new one.",
    );
    return;
  }

  let teams: any[] = [];

  for (const teamId of teamIds) {
    const idTeams = configTeams.filter((t: any) => t.$id === teamId);
    teams.push(...idTeams);
  }

  if (
    !(await approveChanges(
      teams,
      async (args: any) => {
        const teamsService = await getTeamsService();
        return await teamsService.get(args.teamId);
      },
      KeysTeams,
      "teamId",
      "teams",
    ))
  ) {
    return;
  }

  log("Pushing teams ...");

  const pushInstance = await createPushInstance();

  for (let team of teams) {
    log(`Pushing team ${chalk.bold(team["name"])} ...`);
    await pushInstance.pushTeam(team);
  }

  success(`Successfully pushed ${teams.length} teams.`);
};

const pushMessagingTopic = async (): Promise<void> => {
  let topicsIds: string[] = [];
  const configTopics = localConfig.getMessagingTopics();

  if (cliConfig.all) {
    checkDeployConditions(localConfig);
    topicsIds.push(...configTopics.map((b: any) => b.$id));
  }

  if (topicsIds.length === 0) {
    const answers = await inquirer.prompt(questionsPushMessagingTopics);
    if (answers.topics) {
      topicsIds.push(...answers.topics);
    }
  }

  if (topicsIds.length === 0) {
    log("No topics found.");
    hint(
      "Use 'appwrite pull topics' to synchronize existing one, or use 'appwrite init topic' to create a new one.",
    );
    return;
  }

  let topics: any[] = [];

  for (const topicId of topicsIds) {
    const idTopic = configTopics.filter((b: any) => b.$id === topicId);
    topics.push(...idTopic);
  }

  if (
    !(await approveChanges(
      topics,
      async (args: any) => {
        const messagingService = await getMessagingService();
        return await messagingService.getTopic(args.topicId);
      },
      KeysTopics,
      "topicId",
      "topics",
    ))
  ) {
    return;
  }

  log("Pushing topics ...");

  const pushInstance = await createPushInstance();

  for (let topic of topics) {
    log(`Pushing topic ${chalk.bold(topic["name"])} ...`);
    await pushInstance.pushMessagingTopic(topic);
    success(`Created ${topic.name} ( ${topic["$id"]} )`);
  }

  success(`Successfully pushed ${topics.length} topics.`);
};

export const push = new Command("push")
  .description(commandDescriptions["push"])
  .action(actionRunner(() => pushResources({ skipDeprecated: true })));

push
  .command("all")
  .description("Push all resource.")
  .action(
    actionRunner(() => {
      cliConfig.all = true;
      return pushResources({ skipDeprecated: true });
    }),
  );

push
  .command("settings")
  .description("Push project name, services and auth settings")
  .action(actionRunner(pushSettings));

push
  .command("function")
  .alias("functions")
  .description("Push functions in the current directory.")
  .option(`-f, --function-id <function-id>`, `ID of function to run`)
  .option(`-A, --async`, `Don't wait for functions deployments status`)
  .option("--no-code", "Don't push the function's code")
  .option("--with-variables", `Push function variables.`)
  .action(actionRunner(pushFunction));

push
  .command("site")
  .alias("sites")
  .description("Push sites in the current directory.")
  .option(`-f, --site-id <site-id>`, `ID of site to run`)
  .option(`-A, --async`, `Don't wait for sites deployments status`)
  .option("--no-code", "Don't push the site's code")
  .option("--with-variables", `Push site variables.`)
  .action(actionRunner(pushSite));

push
  .command("collection")
  .alias("collections")
  .description(
    "Push collections in the current project. (deprecated, please use 'push tables' instead)",
  )
  .option(
    `-a, --attempts <numberOfAttempts>`,
    `Max number of attempts before timing out. default: 30.`,
  )
  .action(actionRunner(pushCollection));

push
  .command("table")
  .alias("tables")
  .description("Push tables in the current project.")
  .option(
    `-a, --attempts <numberOfAttempts>`,
    `Max number of attempts before timing out. default: 30.`,
  )
  .action(actionRunner(pushTable));

push
  .command("bucket")
  .alias("buckets")
  .description("Push buckets in the current project.")
  .action(actionRunner(pushBucket));

push
  .command("team")
  .alias("teams")
  .description("Push teams in the current project.")
  .action(actionRunner(pushTeam));

push
  .command("topic")
  .alias("topics")
  .description("Push messaging topics in the current project.")
  .action(actionRunner(pushMessagingTopic));

export const deploy = new Command("deploy")
  .description("Removed. Use appwrite push instead")
  .action(
    actionRunner(async () => {
      warn(
        "appwrite deploy has been removed. Please use 'appwrite push' instead",
      );
    }),
  );
