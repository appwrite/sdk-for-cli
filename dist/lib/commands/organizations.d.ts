import { Client } from "@appwrite.io/console";
interface OrganizationsListRequestParams {
    queries?: string[];
    search?: string;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const organizationsList: ({ queries, search, parseOutput, sdk, console: showConsole, }: OrganizationsListRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=organizations.d.ts.map