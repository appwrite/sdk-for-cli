declare class AppwriteException extends Error {
    code?: number;
    type?: string;
    response?: string;
    constructor(message: string, code?: number, type?: string, response?: string);
}
export default AppwriteException;
//# sourceMappingURL=exception.d.ts.map