import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore = require('ignore');
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';

function convertReadStreamToReadableStream(readStream: fs.ReadStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const locale = new Command("locale").description(commandDescriptions['locale'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface LocaleGetRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeGet = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleGetRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListCodesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListCodes = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListCodesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/codes';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListContinentsRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListContinents = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListContinentsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/continents';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListCountriesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListCountries = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListCountriesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/countries';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListCountriesEURequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListCountriesEU = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListCountriesEURequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/countries/eu';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListCountriesPhonesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListCountriesPhones = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListCountriesPhonesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/countries/phones';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListCurrenciesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListCurrencies = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListCurrenciesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/currencies';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface LocaleListLanguagesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const localeListLanguages = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: LocaleListLanguagesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/locale/languages';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
locale
    .command(`get`)
    .description(`Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.  ([IP Geolocation by DB-IP](https://db-ip.com))`)
    .action(actionRunner(localeGet))

locale
    .command(`list-codes`)
    .description(`List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).`)
    .action(actionRunner(localeListCodes))

locale
    .command(`list-continents`)
    .description(`List of all continents. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListContinents))

locale
    .command(`list-countries`)
    .description(`List of all countries. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountries))

locale
    .command(`list-countries-eu`)
    .description(`List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountriesEU))

locale
    .command(`list-countries-phones`)
    .description(`List of all countries phone codes. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCountriesPhones))

locale
    .command(`list-currencies`)
    .description(`List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.`)
    .action(actionRunner(localeListCurrencies))

locale
    .command(`list-languages`)
    .description(`List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.`)
    .action(actionRunner(localeListLanguages))


