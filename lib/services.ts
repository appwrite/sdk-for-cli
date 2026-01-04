import { sdkForConsole } from "./sdks.js";
import {
  Client,
  Account,
  Avatars,
  Backups,
  Assistant,
  Console,
  Databases,
  Domains,
  Functions,
  Graphql,
  Health,
  Locale,
  Messaging,
  Migrations,
  Organizations,
  Project,
  Projects,
  Proxy,
  Sites,
  Storage,
  TablesDB,
  Teams,
  Tokens,
  Users,
  Vcs,
  Realtime,
} from "@appwrite.io/console";

export const getAccountService = async (sdk?: Client): Promise<Account> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Account(client);
};

export const getAvatarsService = async (sdk?: Client): Promise<Avatars> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Avatars(client);
};

export const getBackupsService = async (sdk?: Client): Promise<Backups> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Backups(client);
};

export const getAssistantService = async (sdk?: Client): Promise<Assistant> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Assistant(client);
};

export const getConsoleService = async (sdk?: Client): Promise<Console> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Console(client);
};

export const getDatabasesService = async (sdk?: Client): Promise<Databases> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Databases(client);
};

export const getDomainsService = async (sdk?: Client): Promise<Domains> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Domains(client);
};

export const getFunctionsService = async (sdk?: Client): Promise<Functions> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Functions(client);
};

export const getGraphqlService = async (sdk?: Client): Promise<Graphql> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Graphql(client);
};

export const getHealthService = async (sdk?: Client): Promise<Health> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Health(client);
};

export const getLocaleService = async (sdk?: Client): Promise<Locale> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Locale(client);
};

export const getMessagingService = async (sdk?: Client): Promise<Messaging> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Messaging(client);
};

export const getMigrationsService = async (
  sdk?: Client,
): Promise<Migrations> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Migrations(client);
};

export const getOrganizationsService = async (
  sdk?: Client,
): Promise<Organizations> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Organizations(client);
};

export const getProjectService = async (sdk?: Client): Promise<Project> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Project(client);
};

export const getProjectsService = async (sdk?: Client): Promise<Projects> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Projects(client);
};

export const getProxyService = async (sdk?: Client): Promise<Proxy> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Proxy(client);
};

export const getSitesService = async (sdk?: Client): Promise<Sites> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Sites(client);
};

export const getStorageService = async (sdk?: Client): Promise<Storage> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Storage(client);
};

export const getTablesDBService = async (sdk?: Client): Promise<TablesDB> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new TablesDB(client);
};

export const getTeamsService = async (sdk?: Client): Promise<Teams> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Teams(client);
};

export const getTokensService = async (sdk?: Client): Promise<Tokens> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Tokens(client);
};

export const getUsersService = async (sdk?: Client): Promise<Users> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Users(client);
};

export const getVcsService = async (sdk?: Client): Promise<Vcs> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Vcs(client);
};

export const getRealtimeService = async (sdk?: Client): Promise<Realtime> => {
  const client = !sdk ? await sdkForConsole(true) : sdk;
  return new Realtime(client);
};
