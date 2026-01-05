interface PaginateArgs {
    [key: string]: any;
}
export declare function paginate<T = any>(action: (args: PaginateArgs) => Promise<any>, args: PaginateArgs, limit: number, wrapper: "", queries?: string[]): Promise<T[]>;
export declare function paginate<T = any, K extends string = string>(action: (args: PaginateArgs) => Promise<any>, args: PaginateArgs, limit: number, wrapper: K, queries?: string[]): Promise<Record<K, T[]> & {
    total: number;
}>;
export {};
//# sourceMappingURL=paginate.d.ts.map