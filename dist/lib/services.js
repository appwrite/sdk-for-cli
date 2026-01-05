import { sdkForConsole, sdkForProject } from "./sdks.js";
import { Console, Databases, Functions, Messaging, Organizations, Projects, Proxy, Sites, Storage, TablesDB, Teams, } from "@appwrite.io/console";
export const getConsoleService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Console(client);
};
export const getDatabasesService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Databases(client);
};
export const getFunctionsService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Functions(client);
};
export const getMessagingService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Messaging(client);
};
export const getOrganizationsService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Organizations(client);
};
export const getProjectsService = async (sdk) => {
    const client = !sdk ? await sdkForConsole() : sdk;
    return new Projects(client);
};
export const getProxyService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Proxy(client);
};
export const getSitesService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Sites(client);
};
export const getStorageService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Storage(client);
};
export const getTablesDBService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new TablesDB(client);
};
export const getTeamsService = async (sdk) => {
    const client = !sdk ? await sdkForProject() : sdk;
    return new Teams(client);
};
//# sourceMappingURL=services.js.map