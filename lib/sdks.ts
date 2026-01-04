import { globalConfig, localConfig } from "./config.js";
import { Client } from "@appwrite.io/console";
import os from "os";

export const sdkForConsole = async (
  requiresAuth: boolean = true,
): Promise<Client> => {
  const client = new Client();
  const endpoint = globalConfig.getEndpoint() || "https://cloud.appwrite.io/v1";
  const cookie = globalConfig.getCookie();
  const selfSigned = globalConfig.getSelfSigned();

  if (requiresAuth && cookie === "") {
    throw new Error(
      "Session not found. Please run `appwrite login` to create a session",
    );
  }

  client
    .setEndpoint(endpoint)
    .setCookie(cookie)
    .setProject("console")
    .setSelfSigned(selfSigned)
    .setLocale("en-US");

  client.headers = {
    "content-type": "",
    "x-sdk-name": "Command Line",
    "x-sdk-platform": "console",
    "x-sdk-language": "cli",
    "x-sdk-version": "13.0.0-rc.2",
    "user-agent": `AppwriteCLI/13.0.0-rc.2 (${os.type()} ${os.version()}; ${os.arch()})`,
    "X-Appwrite-Response-Format": "1.8.0",
  };

  return client;
};

export const sdkForProject = async (): Promise<Client> => {
  const client = new Client();

  const endpoint =
    localConfig.getEndpoint() ||
    globalConfig.getEndpoint() ||
    "https://cloud.appwrite.io/v1";

  const project = localConfig.getProject().projectId
    ? localConfig.getProject().projectId
    : globalConfig.getProject();

  const key = globalConfig.getKey();
  const cookie = globalConfig.getCookie();
  const selfSigned = globalConfig.getSelfSigned();

  if (!project) {
    throw new Error(
      "Project is not set. Please run `appwrite init project` to initialize the current directory with an Appwrite project.",
    );
  }

  client
    .setEndpoint(endpoint)
    .setProject(project)
    .setSelfSigned(selfSigned)
    .setLocale("en-US");

  client.headers = {
    "content-type": "",
    "x-sdk-name": "Command Line",
    "x-sdk-platform": "console",
    "x-sdk-language": "cli",
    "x-sdk-version": "13.0.0-rc.2",
    "user-agent": `AppwriteCLI/13.0.0-rc.2 (${os.type()} ${os.version()}; ${os.arch()})`,
    "X-Appwrite-Response-Format": "1.8.0",
  };

  if (cookie) {
    return client.setCookie(cookie).setMode("admin");
  }

  if (key) {
    return client.setKey(key).setMode("default");
  }

  throw new Error(
    "Session not found. Please run `appwrite login` to create a session.",
  );
};
