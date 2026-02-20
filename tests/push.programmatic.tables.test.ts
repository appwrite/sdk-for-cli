import { describe, expect, test, mock } from "bun:test";

describe("Push.pushTables programmatic mode", () => {
  test("uses injected project client for table columns and indexes", async () => {
    const projectClient = { _tag: "project-client" } as any;
    const consoleClient = { _tag: "console-client" } as any;

    const databaseServiceClientArgs: any[] = [];
    const tableServiceClientArgs: any[] = [];

    mock.module("../lib/services.js", () => {
      const databasesService = {
        createStringAttribute: async () => ({}),
        createIndex: async () => ({}),
        listAttributes: async () => ({
          total: 1,
          attributes: [{ key: "title", status: "available" }],
        }),
        listIndexes: async () => ({
          total: 1,
          indexes: [{ key: "idx_title", status: "available" }],
        }),
      };

      const tablesService = {
        getTable: async () => {
          throw { code: 404 };
        },
        createTable: async () => ({}),
      };

      const throwIfNoProjectClient = (sdk?: any) => {
        if (!sdk) {
          throw new Error(
            "Project is not set. Please run `appwrite init project`.",
          );
        }
      };

      return {
        getProxyService: async () => ({}),
        getConsoleService: async () => ({}),
        getFunctionsService: async () => ({}),
        getSitesService: async () => ({}),
        getStorageService: async () => ({}),
        getMessagingService: async () => ({}),
        getOrganizationsService: async () => ({}),
        getTeamsService: async () => ({}),
        getProjectsService: async () => ({}),
        getDatabasesService: async (sdk?: any) => {
          databaseServiceClientArgs.push(sdk);
          throwIfNoProjectClient(sdk);
          return databasesService as any;
        },
        getTablesDBService: async (sdk?: any) => {
          tableServiceClientArgs.push(sdk);
          throwIfNoProjectClient(sdk);
          return tablesService as any;
        },
      };
    });

    const { Push } = await import("../lib/commands/push.ts");
    const push = new Push(projectClient, consoleClient, true);

    const result = await push.pushTables(
      [
        {
          $id: "tbl_1",
          databaseId: "db_1",
          name: "Regression Table",
          rowSecurity: true,
          enabled: true,
          columns: [
            {
              key: "title",
              type: "string",
              size: 255,
              required: true,
              default: null,
              array: false,
              encrypt: false,
            },
          ],
          indexes: [
            {
              key: "idx_title",
              type: "key",
              columns: ["title"],
              orders: ["ASC"],
            },
          ],
        },
      ],
      { attempts: 1, skipConfirmation: true },
    );

    expect(result.errors).toHaveLength(0);
    expect(result.successfullyPushed).toBe(1);
    expect(databaseServiceClientArgs.length).toBeGreaterThan(0);
    expect(
      databaseServiceClientArgs.every((sdk) => sdk === projectClient),
    ).toBe(true);
    expect(tableServiceClientArgs.length).toBeGreaterThan(0);
    expect(tableServiceClientArgs.every((sdk) => sdk === projectClient)).toBe(
      true,
    );
  });
});
