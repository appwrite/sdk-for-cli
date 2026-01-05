import type { Headers, RequestParams, ResponseType } from "./types.js";
declare class Client {
    private endpoint;
    private headers;
    private selfSigned;
    constructor();
    /**
     * Set Cookie
     *
     * Your cookie
     *
     * @param {string} cookie
     *
     * @return self
     */
    setCookie(cookie: string): this;
    /**
     * Set Project
     *
     * Your project ID
     *
     * @param {string} project
     *
     * @return self
     */
    setProject(project: string): this;
    /**
     * Set Key
     *
     * Your secret API key
     *
     * @param {string} key
     *
     * @return self
     */
    setKey(key: string): this;
    /**
     * Set JWT
     *
     * Your secret JSON Web Token
     *
     * @param {string} jwt
     *
     * @return self
     */
    setJWT(jwt: string): this;
    /**
     * Set Locale
     *
     * @param {string} locale
     *
     * @return self
     */
    setLocale(locale: string): this;
    /**
     * Set Mode
     *
     * @param {string} mode
     *
     * @return self
     */
    setMode(mode: string): this;
    /**
     * Set self signed.
     *
     * @param {bool} status
     *
     * @return this
     */
    setSelfSigned(status: boolean): this;
    /**
     * Set endpoint.
     *
     * @param {string} endpoint
     *
     * @return this
     */
    setEndpoint(endpoint: string): this;
    /**
     * @param {string} key
     * @param {string} value
     */
    addHeader(key: string, value: string): this;
    call<T = unknown>(method: string, path?: string, headers?: Headers, params?: RequestParams, responseType?: ResponseType): Promise<T>;
    static flatten(data: RequestParams, prefix?: string): Record<string, unknown>;
}
export default Client;
//# sourceMappingURL=client.d.ts.map