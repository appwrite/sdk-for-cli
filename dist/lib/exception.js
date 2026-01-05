class AppwriteException extends Error {
    code;
    type;
    response;
    constructor(message, code, type, response) {
        super(message);
        this.name = "AppwriteException";
        this.code = code;
        this.type = type;
        this.response = response;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppwriteException);
        }
    }
}
export default AppwriteException;
//# sourceMappingURL=exception.js.map