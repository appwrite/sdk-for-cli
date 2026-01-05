/**
 * Get the latest version from npm registry
 */
export declare function getLatestVersion(): Promise<string>;
/**
 * Compare versions using semantic versioning
 */
export declare function compareVersions(current: string, latest: string): number;
export declare function getAllFiles(folder: string): string[];
export declare function isPortTaken(port: number): Promise<boolean>;
export declare function systemHasCommand(command: string): boolean;
export declare const checkDeployConditions: (localConfig: any) => void;
export declare function showConsoleLink(serviceName: string, action: string, ...ids: string[]): void;
export declare function isCloud(): boolean;
//# sourceMappingURL=utils.d.ts.map