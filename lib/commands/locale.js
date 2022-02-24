const fs = require('fs');
const { promisify } = require('util');
const libClient = require('../client.js');
const childProcess = require('child_process');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const locale = new Command("locale").description(commandDescriptions['locale'])

const localeGet = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetContinents = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/continents';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetCountries = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/countries';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetCountriesEU = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/countries/eu';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetCountriesPhones = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/countries/phones';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetCurrencies = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/currencies';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const localeGetLanguages = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/locale/languages';
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
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
    .command(`getContinents`)
    .description(`List of all continents. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeGetContinents))

locale
    .command(`getCountries`)
    .description(`List of all countries. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeGetCountries))

locale
    .command(`getCountriesEU`)
    .description(`List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeGetCountriesEU))

locale
    .command(`getCountriesPhones`)
    .description(`List of all countries phone codes. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeGetCountriesPhones))

locale
    .command(`getCurrencies`)
    .description(`List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeGetCurrencies))

locale
    .command(`getLanguages`)
    .description(`List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.`)
    .action(actionRunner(localeGetLanguages))


module.exports = {
    locale,
    localeGet,
    localeGetContinents,
    localeGetCountries,
    localeGetCountriesEU,
    localeGetCountriesPhones,
    localeGetCurrencies,
    localeGetLanguages
};