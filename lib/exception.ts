class AppwriteException extends Error {
    public code?: number;
    public type?: string;
    public response?: string;

    constructor(message: string, code?: number, type?: string, response?: string) {
        super(message);
        this.name = 'AppwriteException';
        this.code = code;
        this.type = type;
        this.response = response;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppwriteException);
        }
    }
}

export = AppwriteException;
