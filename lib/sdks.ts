import Client = require('./client');
import { globalConfig, localConfig } from './config';

export const sdkForConsole = async (requiresAuth: boolean = true): Promise<Client> => {
    const client = new Client();
    const endpoint = globalConfig.getEndpoint();
    const cookie = globalConfig.getCookie();
    const selfSigned = globalConfig.getSelfSigned();

    if (requiresAuth && cookie === '') {
        throw new Error('Session not found. Please run `appwrite login` to create a session');
    }

    client
        .setEndpoint(endpoint)
        .setCookie(cookie)
        .setProject('console')
        .setSelfSigned(selfSigned)
        .setLocale('en-US');

    return client;
};

export const sdkForProject = async (): Promise<Client> => {
    const client = new Client();
    const endpoint = localConfig.getEndpoint() || globalConfig.getEndpoint();
    const project = localConfig.getProject().projectId ? localConfig.getProject().projectId : globalConfig.getProject();
    const key = globalConfig.getKey();
    const cookie = globalConfig.getCookie();
    const selfSigned = globalConfig.getSelfSigned();

    if (!project) {
        throw new Error('Project is not set. Please run `appwrite init project` to initialize the current directory with an Appwrite project.');
    }

    client
        .setEndpoint(endpoint)
        .setProject(project)
        .setSelfSigned(selfSigned)
        .setLocale('en-US');

    if (cookie) {
        return client
            .setCookie(cookie)
            .setMode('admin');
    }

    if (key) {
        return client
            .setKey(key)
            .setMode('default');
    }

    throw new Error('Session not found. Please run `appwrite login` to create a session.');
};
