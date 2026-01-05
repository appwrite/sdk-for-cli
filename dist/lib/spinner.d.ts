import progress from "cli-progress";
declare const SPINNER_ARC = "arc";
declare const SPINNER_DOTS = "dots";
interface SpinnerPayload {
    status: string;
    resource: string;
    id: string;
    prefix?: string;
    end?: string;
    errorMessage?: string;
}
declare class Spinner {
    static updatesBar: progress.MultiBar;
    private bar;
    private spinnerInterval?;
    static start(clearOnComplete?: boolean, hideCursor?: boolean): void;
    static stop(): void;
    static formatter(options: any, params: any, payload: SpinnerPayload): string;
    static line(prefix: string, start: string, middle: string, end: string, separator?: string): string;
    constructor(payload: SpinnerPayload, total?: number, startValue?: number);
    update(payload: Partial<SpinnerPayload>): this;
    fail(payload: Partial<SpinnerPayload>): void;
    startSpinner(name: string): void;
    stopSpinner(): void;
    replaceSpinner(name: string): void;
}
export { Spinner, SPINNER_ARC, SPINNER_DOTS };
//# sourceMappingURL=spinner.d.ts.map