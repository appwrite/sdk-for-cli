const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");
const { File } = require('undici');
const { ReadableStream } = require('stream/web');

/**
 * @param {fs.ReadStream} readStream
 * @returns {ReadableStream}
 */
function convertReadStreamToReadableStream(readStream) {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

const locale = new Command("locale").description(commandDescriptions['locale']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} LocaleGetRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleGetRequestParams} params
 */
const localeGet = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListCodesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListCodesRequestParams} params
 */
const localeListCodes = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/codes';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListContinentsRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListContinentsRequestParams} params
 */
const localeListContinents = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/continents';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListCountriesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListCountriesRequestParams} params
 */
const localeListCountries = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/countries';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListCountriesEURequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListCountriesEURequestParams} params
 */
const localeListCountriesEU = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/countries/eu';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListCountriesPhonesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListCountriesPhonesRequestParams} params
 */
const localeListCountriesPhones = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/countries/phones';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListCurrenciesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListCurrenciesRequestParams} params
 */
const localeListCurrencies = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/currencies';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} LocaleListLanguagesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {LocaleListLanguagesRequestParams} params
 */
const localeListLanguages = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/locale/languages';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

locale
    .command(`get`)
    .description(`Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.  ([IP Geolocation by DB-IP](https://db-ip.com))`)
    .action(actionRunner(localeGet))

locale
    .command(`listCodes`)
    .description(`List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).`)
    .action(actionRunner(localeListCodes))

locale
    .command(`listContinents`)
    .description(`List of all continents. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListContinents))

locale
    .command(`listCountries`)
    .description(`List of all countries. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountries))

locale
    .command(`listCountriesEU`)
    .description(`List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountriesEU))

locale
    .command(`listCountriesPhones`)
    .description(`List of all countries phone codes. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountriesPhones))

locale
    .command(`listCurrencies`)
    .description(`List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCurrencies))

locale
    .command(`listLanguages`)
    .description(`List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.`)
    .action(actionRunner(localeListLanguages))

module.exports = {
    locale,
    localeGet,
    localeListCodes,
    localeListContinents,
    localeListCountries,
    localeListCountriesEU,
    localeListCountriesPhones,
    localeListCurrencies,
    localeListLanguages
};