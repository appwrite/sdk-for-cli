const os = require('os');
const https = require("https");
const axios = require("axios");
const JSONbig = require("json-bigint")({ storeAsString: false });
const FormData = require("form-data");
const AppwriteException = require("./exception.js");
const { globalConfig } = require("./config.js");

class Client {
  static CHUNK_SIZE = 5*1024*1024; // 5MB
  
  constructor() {
    this.endpoint = 'https://HOSTNAME/v1';
    this.headers = {
      'content-type': '',
      'x-sdk-name': 'Command Line',
      'x-sdk-platform': 'console',
      'x-sdk-language': 'cli',
      'x-sdk-version': '2.0.1',
      'user-agent' : `AppwriteCLI/2.0.1 (${os.type()} ${os.version()}; ${os.arch()})`,
      'X-Appwrite-Response-Format' : '1.0.0',
    };
  }

  /**
   * Set Cookie
   *
   * Your cookie
   *
   * @param {string} cookie
   *
   * @return self
   */
  setCookie(cookie) {
    this.addHeader("cookie", cookie);

    return this;
  }

    /**
     * Set Project
     *
     * Your project ID
     *
     * @param {string} project
     *
     * @return self
     */
    setProject(project) {
        this.addHeader('X-Appwrite-Project', project);

        return this;
    }

    /**
     * Set Key
     *
     * Your secret API key
     *
     * @param {string} key
     *
     * @return self
     */
    setKey(key) {
        this.addHeader('X-Appwrite-Key', key);

        return this;
    }

    /**
     * Set JWT
     *
     * Your secret JSON Web Token
     *
     * @param {string} jwt
     *
     * @return self
     */
    setJWT(jwt) {
        this.addHeader('X-Appwrite-JWT', jwt);

        return this;
    }

    /**
     * Set Locale
     *
     * @param {string} locale
     *
     * @return self
     */
    setLocale(locale) {
        this.addHeader('X-Appwrite-Locale', locale);

        return this;
    }

    /**
     * Set Mode
     *
     * @param {string} mode
     *
     * @return self
     */
    setMode(mode) {
        this.addHeader('X-Appwrite-Mode', mode);

        return this;
    }

  /**
   * Set self signed.
   *
   * @param {bool} status
   *
   * @return this
   */
  setSelfSigned(status) {
    this.selfSigned = status;

    return this;
  }

  /**
   * Set endpoint.
   *
   * @param {string} endpoint
   *
   * @return this
   */
  setEndpoint(endpoint) {
    this.endpoint = endpoint;

    return this;
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  addHeader(key, value) {
    this.headers[key.toLowerCase()] = value;

    return this;
  }

  async call(
    method,
    path = "",
    headers = {},
    params = {},
    responseType = "json"
  ) {
    headers = Object.assign({}, this.headers, headers);

    let contentType = headers["content-type"].toLowerCase();

    let formData = null;

    if (contentType.startsWith("multipart/form-data")) {
      const form = new FormData();

      let flatParams = Client.flatten(params);

      for (const key in flatParams) {
        form.append(key, flatParams[key]);
      }

      headers = {
        ...headers,
        ...form.getHeaders(),
      };

      formData = form;
    }

    let options = {
      method: method.toUpperCase(),
      url: this.endpoint + path,
      params: method.toUpperCase() === "GET" ? params : {},
      headers: headers,
      data:
        method.toUpperCase() === "GET" || contentType.startsWith("multipart/form-data") ? formData : params,
      json: contentType.startsWith("application/json"),
      transformRequest: method.toUpperCase() === "GET" || contentType.startsWith("multipart/form-data") ? undefined : (data) =>  JSONbig.stringify(data),
      transformResponse: [ (data) =>  data ? JSONbig.parse(data) : data ],
      responseType: responseType,
    };
    if (this.selfSigned == true) {
      // Allow self signed requests
      options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    }
    try {
      let response = await axios(options);
      if (response.headers["set-cookie"]) {
        globalConfig.setCookie(response.headers["set-cookie"][0]);
      }
      return response.data;
    } catch (error) {
      if ("response" in error && error.response !== undefined) {
        if (error.response && "data" in error.response) {
          if (typeof error.response.data === "string") {
            throw new AppwriteException(
              error.response.data,
              error.response.status,
              error.response.data
            );
          } else {
            throw new AppwriteException(
              error.response.data.message,
              error.response.status,
              error.response.data
            );
          }
        } else {
          throw new AppwriteException(
            error.response.statusText,
            error.response.status,
            error.response.data
          );
        }
      } else {
        throw new AppwriteException(error.message);
      }
    }
  }

  static flatten(data, prefix = "") {
    let output = {};

    for (const key in data) {
      let value = data[key];
      let finalKey = prefix ? prefix + "[" + key + "]" : key;

      if (Array.isArray(value)) {
        output = Object.assign(output, Client.flatten(value, finalKey)); // @todo: handle name collision here if needed
      } else {
        output[finalKey] = value;
      }
    }

    return output;
  }
}

module.exports = Client;
