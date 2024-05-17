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

const avatars = new Command("avatars").description(commandDescriptions['avatars']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} AvatarsGetBrowserRequestParams
 * @property {Browser} code Browser Code.
 * @property {number} width Image width. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} height Image height. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} quality Image quality. Pass an integer between 0 to 100. Defaults to 100.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetBrowserRequestParams} params
 */
const avatarsGetBrowser = async ({ code, width, height, quality, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/browsers/{code}'.replace('{code}', code);
    let payload = {};
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    if (typeof quality !== 'undefined') {
        payload['quality'] = quality;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetCreditCardRequestParams
 * @property {CreditCard} code Credit Card Code. Possible values: amex, argencard, cabal, cencosud, diners, discover, elo, hipercard, jcb, mastercard, naranja, targeta-shopping, union-china-pay, visa, mir, maestro.
 * @property {number} width Image width. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} height Image height. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} quality Image quality. Pass an integer between 0 to 100. Defaults to 100.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetCreditCardRequestParams} params
 */
const avatarsGetCreditCard = async ({ code, width, height, quality, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/credit-cards/{code}'.replace('{code}', code);
    let payload = {};
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    if (typeof quality !== 'undefined') {
        payload['quality'] = quality;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetFaviconRequestParams
 * @property {string} url Website URL which you want to fetch the favicon from.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetFaviconRequestParams} params
 */
const avatarsGetFavicon = async ({ url, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/favicon';
    let payload = {};
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetFlagRequestParams
 * @property {Flag} code Country Code. ISO Alpha-2 country code format.
 * @property {number} width Image width. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} height Image height. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} quality Image quality. Pass an integer between 0 to 100. Defaults to 100.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetFlagRequestParams} params
 */
const avatarsGetFlag = async ({ code, width, height, quality, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/flags/{code}'.replace('{code}', code);
    let payload = {};
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    if (typeof quality !== 'undefined') {
        payload['quality'] = quality;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetImageRequestParams
 * @property {string} url Image URL which you want to crop.
 * @property {number} width Resize preview image width, Pass an integer between 0 to 2000. Defaults to 400.
 * @property {number} height Resize preview image height, Pass an integer between 0 to 2000. Defaults to 400.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetImageRequestParams} params
 */
const avatarsGetImage = async ({ url, width, height, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/image';
    let payload = {};
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetInitialsRequestParams
 * @property {string} name Full Name. When empty, current user name or email will be used. Max length: 128 chars.
 * @property {number} width Image width. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {number} height Image height. Pass an integer between 0 to 2000. Defaults to 100.
 * @property {string} background Changes background color. By default a random color will be picked and stay will persistent to the given name.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetInitialsRequestParams} params
 */
const avatarsGetInitials = async ({ name, width, height, background, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/initials';
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    if (typeof background !== 'undefined') {
        payload['background'] = background;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} AvatarsGetQRRequestParams
 * @property {string} text Plain text to be converted to QR code image.
 * @property {number} size QR code size. Pass an integer between 1 to 1000. Defaults to 400.
 * @property {number} margin Margin from edge. Pass an integer between 0 to 10. Defaults to 1.
 * @property {boolean} download Return resulting image with &#039;Content-Disposition: attachment &#039; headers for the browser to start downloading it. Pass 0 for no header, or 1 for otherwise. Default value is set to 0.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {AvatarsGetQRRequestParams} params
 */
const avatarsGetQR = async ({ text, size, margin, download, parseOutput = true, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/avatars/qr';
    let payload = {};
    if (typeof text !== 'undefined') {
        payload['text'] = text;
    }
    if (typeof size !== 'undefined') {
        payload['size'] = size;
    }
    if (typeof margin !== 'undefined') {
        payload['margin'] = margin;
    }
    if (typeof download !== 'undefined') {
        payload['download'] = download;
    }
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

avatars
    .command(`getBrowser`)
    .description(`You can use this endpoint to show different browser icons to your users. The code argument receives the browser code as it appears in your user [GET /account/sessions](https://appwrite.io/docs/references/cloud/client-web/account#getSessions) endpoint. Use width, height and quality arguments to change the output settings.  When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px.`)
    .requiredOption(`--code <code>`, `Browser Code.`)
    .option(`--width <width>`, `Image width. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--height <height>`, `Image height. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--quality <quality>`, `Image quality. Pass an integer between 0 to 100. Defaults to 100.`, parseInteger)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetBrowser))

avatars
    .command(`getCreditCard`)
    .description(`The credit card endpoint will return you the icon of the credit card provider you need. Use width, height and quality arguments to change the output settings.  When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px. `)
    .requiredOption(`--code <code>`, `Credit Card Code. Possible values: amex, argencard, cabal, cencosud, diners, discover, elo, hipercard, jcb, mastercard, naranja, targeta-shopping, union-china-pay, visa, mir, maestro.`)
    .option(`--width <width>`, `Image width. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--height <height>`, `Image height. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--quality <quality>`, `Image quality. Pass an integer between 0 to 100. Defaults to 100.`, parseInteger)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetCreditCard))

avatars
    .command(`getFavicon`)
    .description(`Use this endpoint to fetch the favorite icon (AKA favicon) of any remote website URL. `)
    .requiredOption(`--url <url>`, `Website URL which you want to fetch the favicon from.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetFavicon))

avatars
    .command(`getFlag`)
    .description(`You can use this endpoint to show different country flags icons to your users. The code argument receives the 2 letter country code. Use width, height and quality arguments to change the output settings. Country codes follow the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.  When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px. `)
    .requiredOption(`--code <code>`, `Country Code. ISO Alpha-2 country code format.`)
    .option(`--width <width>`, `Image width. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--height <height>`, `Image height. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--quality <quality>`, `Image quality. Pass an integer between 0 to 100. Defaults to 100.`, parseInteger)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetFlag))

avatars
    .command(`getImage`)
    .description(`Use this endpoint to fetch a remote image URL and crop it to any image size you want. This endpoint is very useful if you need to crop and display remote images in your app or in case you want to make sure a 3rd party image is properly served using a TLS protocol.  When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 400x400px. `)
    .requiredOption(`--url <url>`, `Image URL which you want to crop.`)
    .option(`--width <width>`, `Resize preview image width, Pass an integer between 0 to 2000. Defaults to 400.`, parseInteger)
    .option(`--height <height>`, `Resize preview image height, Pass an integer between 0 to 2000. Defaults to 400.`, parseInteger)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetImage))

avatars
    .command(`getInitials`)
    .description(`Use this endpoint to show your user initials avatar icon on your website or app. By default, this route will try to print your logged-in user name or email initials. You can also overwrite the user name if you pass the 'name' parameter. If no name is given and no user is logged, an empty avatar will be returned.  You can use the color and background params to change the avatar colors. By default, a random theme will be selected. The random theme will persist for the user's initials when reloading the same theme will always return for the same initials.  When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px. `)
    .option(`--name <name>`, `Full Name. When empty, current user name or email will be used. Max length: 128 chars.`)
    .option(`--width <width>`, `Image width. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--height <height>`, `Image height. Pass an integer between 0 to 2000. Defaults to 100.`, parseInteger)
    .option(`--background <background>`, `Changes background color. By default a random color will be picked and stay will persistent to the given name.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetInitials))

avatars
    .command(`getQR`)
    .description(`Converts a given plain text to a QR code image. You can use the query parameters to change the size and style of the resulting image. `)
    .requiredOption(`--text <text>`, `Plain text to be converted to QR code image.`)
    .option(`--size <size>`, `QR code size. Pass an integer between 1 to 1000. Defaults to 400.`, parseInteger)
    .option(`--margin <margin>`, `Margin from edge. Pass an integer between 0 to 10. Defaults to 1.`, parseInteger)
    .option(`--download <download>`, `Return resulting image with 'Content-Disposition: attachment ' headers for the browser to start downloading it. Pass 0 for no header, or 1 for otherwise. Default value is set to 0.`, parseBool)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(avatarsGetQR))

module.exports = {
    avatars,
    avatarsGetBrowser,
    avatarsGetCreditCard,
    avatarsGetFavicon,
    avatarsGetFlag,
    avatarsGetImage,
    avatarsGetInitials,
    avatarsGetQR
};