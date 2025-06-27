const os = require('os');
const https = require("https");
const { fetch, FormData, Agent } = require("undici");
const JSONbig = require("json-bigint")({ storeAsString: false });
const AppwriteException = require("./exception.js");
const { globalConfig } = require("./config.js");
const chalk = require("chalk");

class Client {
  CHUNK_SIZE = 5*1024*1024; // 5MB

  constructor() {
    this.endpoint = 'https://cloud.appwrite.io/v1';
    this.headers = {
      'content-type': '',
      'x-sdk-name': 'Command Line',
      'x-sdk-platform': 'console',
      'x-sdk-language': 'cli',
      'x-sdk-version': '8.1.0',
      'user-agent' : `AppwriteCLI/8.1.0 (${os.type()} ${os.version()}; ${os.arch()})`,
      'X-Appwrite-Response-Format' : '1.7.0',
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
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      throw new AppwriteException('Invalid endpoint URL: ' + endpoint);
    }

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

  async call(method, path = "", headers = {}, params = {}, responseType = "json") {
    headers = {...this.headers, ...headers};
    const url = new URL(this.endpoint + path);

    let body = undefined;

    if (method.toUpperCase() === "GET") {
      url.search = new URLSearchParams(Client.flatten(params)).toString();
    } else if (headers["content-type"]?.toLowerCase().startsWith("multipart/form-data")) {
      delete headers["content-type"];
      const formData = new FormData();

      const flatParams = Client.flatten(params);

      for (const [key, value] of Object.entries(flatParams)) {
          if (value && value.type && value.type === "file") {
              formData.append(key, value.file, value.filename);
          } else {
              formData.append(key, value);
          }
      }

      body = formData;
    } else {
      body = JSONbig.stringify(params);
    }

    let response = undefined;
    try {
      response = await fetch(url.toString(), {
        method: method.toUpperCase(),
        headers,
        body,
        dispatcher: new Agent({
            connect: {
                rejectUnauthorized: !this.selfSigned,
            },
        }),
      });

      const warnings = response.headers.get('x-appwrite-warning');
      if (warnings) {
          warnings.split(';').forEach((warning) => console.warn(warning));
      }
    } catch (error) {
      throw new AppwriteException(error.message);
    }

    if (response.status >= 400) {
      const text = await response.text();
      let json = undefined;
      try {
        json = JSON.parse(text);
      } catch (error) {
        throw new AppwriteException(text, response.status, "", text);
      }

      if (path !== '/account' && json.code === 401 && json.type === 'user_more_factors_required') {
        console.log(`${chalk.cyan.bold("ℹ Info")} ${chalk.cyan("Unusable account found, removing...")}`);

        const current = globalConfig.getCurrentSession();
        globalConfig.setCurrentSession('');
        globalConfig.removeSession(current);
      }
      throw new AppwriteException(json.message, json.code, json.type, text);
    }

    if (responseType === "arraybuffer") {
      const data = await response.arrayBuffer();
      return data;
    }

    let cookies = response.headers.getSetCookie();
    if (cookies && cookies.length > 0) {
      for (const cookie of cookies) {
        if (cookie.startsWith('a_session_console=')) {
          globalConfig.setCookie(cookie);
        }
      }
    }

    const text = await response.text();
    let json = undefined;
    try {
      json = JSONbig.parse(text);
    } catch (error) {
      return text;
    }
    return json;
  }

  static flatten(data, prefix = '') {
    let output = {};

    for (const key in data) {
      let value = data[key];
      let finalKey = prefix ? prefix + '[' + key +']' : key;

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
