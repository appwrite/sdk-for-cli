import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Locale } from "@appwrite.io/console";

let localeClient: Locale | null = null;

const getLocaleClient = async (): Promise<Locale> => {
  if (!localeClient) {
    const sdkClient = await sdkForProject();
    localeClient = new Locale(sdkClient);
  }
  return localeClient;
};

export const locale = new Command("locale")
  .description(commandDescriptions["locale"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

locale
  .command(`get`)
  .description(
    `Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.

([IP Geolocation by DB-IP](https://db-ip.com))`,
  )
  .action(actionRunner(async () => await (await getLocaleClient()).get()));

locale
  .command(`list-codes`)
  .description(
    `List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listCodes()),
  );

locale
  .command(`list-continents`)
  .description(
    `List of all continents. You can use the locale header to get the data in a supported language.`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listContinents()),
  );

locale
  .command(`list-countries`)
  .description(
    `List of all countries. You can use the locale header to get the data in a supported language.`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listCountries()),
  );

locale
  .command(`list-countries-eu`)
  .description(
    `List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listCountriesEU()),
  );

locale
  .command(`list-countries-phones`)
  .description(
    `List of all countries phone codes. You can use the locale header to get the data in a supported language.`,
  )
  .action(
    actionRunner(
      async () => await (await getLocaleClient()).listCountriesPhones(),
    ),
  );

locale
  .command(`list-currencies`)
  .description(
    `List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listCurrencies()),
  );

locale
  .command(`list-languages`)
  .description(
    `List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.`,
  )
  .action(
    actionRunner(async () => await (await getLocaleClient()).listLanguages()),
  );
