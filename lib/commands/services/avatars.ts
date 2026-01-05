import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  parseBool,
  parseInteger,
} from "../../parser.js";
import {
  Avatars,
  Browser,
  CreditCard,
  Flag,
  ImageFormat,
} from "@appwrite.io/console";

let avatarsClient: Avatars | null = null;

const getAvatarsClient = async (): Promise<Avatars> => {
  if (!avatarsClient) {
    const sdkClient = await sdkForProject();
    avatarsClient = new Avatars(sdkClient);
  }
  return avatarsClient;
};

export const avatars = new Command("avatars")
  .description(commandDescriptions["avatars"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

avatars
  .command(`get-browser`)
  .description(
    `You can use this endpoint to show different browser icons to your users. The code argument receives the browser code as it appears in your user [GET /account/sessions](https://appwrite.io/docs/references/cloud/client-web/account#getSessions) endpoint. Use width, height and quality arguments to change the output settings.

When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px.`,
  )
  .requiredOption(`--code <code>`, `Browser Code.`)
  .option(
    `--width <width>`,
    `Image width. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Image height. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--quality <quality>`,
    `Image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ code, width, height, quality }) =>
        await (
          await getAvatarsClient()
        ).getBrowser(code as Browser, width, height, quality),
    ),
  );

avatars
  .command(`get-credit-card`)
  .description(
    `The credit card endpoint will return you the icon of the credit card provider you need. Use width, height and quality arguments to change the output settings.

When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px.
`,
  )
  .requiredOption(
    `--code <code>`,
    `Credit Card Code. Possible values: amex, argencard, cabal, cencosud, diners, discover, elo, hipercard, jcb, mastercard, naranja, targeta-shopping, unionpay, visa, mir, maestro, rupay.`,
  )
  .option(
    `--width <width>`,
    `Image width. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Image height. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--quality <quality>`,
    `Image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ code, width, height, quality }) =>
        await (
          await getAvatarsClient()
        ).getCreditCard(code as CreditCard, width, height, quality),
    ),
  );

avatars
  .command(`get-favicon`)
  .description(
    `Use this endpoint to fetch the favorite icon (AKA favicon) of any remote website URL.

This endpoint does not follow HTTP redirects.`,
  )
  .requiredOption(
    `--url <url>`,
    `Website URL which you want to fetch the favicon from.`,
  )
  .action(
    actionRunner(
      async ({ url }) => await (await getAvatarsClient()).getFavicon(url),
    ),
  );

avatars
  .command(`get-flag`)
  .description(
    `You can use this endpoint to show different country flags icons to your users. The code argument receives the 2 letter country code. Use width, height and quality arguments to change the output settings. Country codes follow the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.

When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px.
`,
  )
  .requiredOption(
    `--code <code>`,
    `Country Code. ISO Alpha-2 country code format.`,
  )
  .option(
    `--width <width>`,
    `Image width. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Image height. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--quality <quality>`,
    `Image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ code, width, height, quality }) =>
        await (
          await getAvatarsClient()
        ).getFlag(code as Flag, width, height, quality),
    ),
  );

avatars
  .command(`get-image`)
  .description(
    `Use this endpoint to fetch a remote image URL and crop it to any image size you want. This endpoint is very useful if you need to crop and display remote images in your app or in case you want to make sure a 3rd party image is properly served using a TLS protocol.

When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 400x400px.

This endpoint does not follow HTTP redirects.`,
  )
  .requiredOption(`--url <url>`, `Image URL which you want to crop.`)
  .option(
    `--width <width>`,
    `Resize preview image width, Pass an integer between 0 to 2000. Defaults to 400.`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Resize preview image height, Pass an integer between 0 to 2000. Defaults to 400.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ url, width, height }) =>
        await (await getAvatarsClient()).getImage(url, width, height),
    ),
  );

avatars
  .command(`get-initials`)
  .description(
    `Use this endpoint to show your user initials avatar icon on your website or app. By default, this route will try to print your logged-in user name or email initials. You can also overwrite the user name if you pass the 'name' parameter. If no name is given and no user is logged, an empty avatar will be returned.

You can use the color and background params to change the avatar colors. By default, a random theme will be selected. The random theme will persist for the user's initials when reloading the same theme will always return for the same initials.

When one dimension is specified and the other is 0, the image is scaled with preserved aspect ratio. If both dimensions are 0, the API provides an image at source quality. If dimensions are not specified, the default size of image returned is 100x100px.
`,
  )
  .option(
    `--name <name>`,
    `Full Name. When empty, current user name or email will be used. Max length: 128 chars.`,
  )
  .option(
    `--width <width>`,
    `Image width. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Image height. Pass an integer between 0 to 2000. Defaults to 100.`,
    parseInteger,
  )
  .option(
    `--background <background>`,
    `Changes background color. By default a random color will be picked and stay will persistent to the given name.`,
  )
  .action(
    actionRunner(
      async ({ name, width, height, background }) =>
        await (
          await getAvatarsClient()
        ).getInitials(name, width, height, background),
    ),
  );

avatars
  .command(`get-qr`)
  .description(
    `Converts a given plain text to a QR code image. You can use the query parameters to change the size and style of the resulting image.
`,
  )
  .requiredOption(
    `--text <text>`,
    `Plain text to be converted to QR code image.`,
  )
  .option(
    `--size <size>`,
    `QR code size. Pass an integer between 1 to 1000. Defaults to 400.`,
    parseInteger,
  )
  .option(
    `--margin <margin>`,
    `Margin from edge. Pass an integer between 0 to 10. Defaults to 1.`,
    parseInteger,
  )
  .option(
    `--download [value]`,
    `Return resulting image with 'Content-Disposition: attachment ' headers for the browser to start downloading it. Pass 0 for no header, or 1 for otherwise. Default value is set to 0.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ text, size, margin, download }) =>
        await (await getAvatarsClient()).getQR(text, size, margin, download),
    ),
  );

avatars
  .command(`get-screenshot`)
  .description(
    `Use this endpoint to capture a screenshot of any website URL. This endpoint uses a headless browser to render the webpage and capture it as an image.

You can configure the browser viewport size, theme, user agent, geolocation, permissions, and more. Capture either just the viewport or the full page scroll.

When width and height are specified, the image is resized accordingly. If both dimensions are 0, the API provides an image at original size. If dimensions are not specified, the default viewport size is 1280x720px.`,
  )
  .requiredOption(`--url <url>`, `Website URL which you want to capture.`)
  .option(
    `--headers <headers>`,
    `HTTP headers to send with the browser request. Defaults to empty.`,
  )
  .option(
    `--viewport-width <viewport-width>`,
    `Browser viewport width. Pass an integer between 1 to 1920. Defaults to 1280.`,
    parseInteger,
  )
  .option(
    `--viewport-height <viewport-height>`,
    `Browser viewport height. Pass an integer between 1 to 1080. Defaults to 720.`,
    parseInteger,
  )
  .option(
    `--scale <scale>`,
    `Browser scale factor. Pass a number between 0.1 to 3. Defaults to 1.`,
    parseInteger,
  )
  .option(
    `--theme <theme>`,
    `Browser theme. Pass "light" or "dark". Defaults to "light".`,
  )
  .option(
    `--user-agent <user-agent>`,
    `Custom user agent string. Defaults to browser default.`,
  )
  .option(
    `--fullpage [value]`,
    `Capture full page scroll. Pass 0 for viewport only, or 1 for full page. Defaults to 0.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--locale <locale>`,
    `Browser locale (e.g., "en-US", "fr-FR"). Defaults to browser default.`,
  )
  .option(
    `--timezone <timezone>`,
    `IANA timezone identifier (e.g., "America/New_York", "Europe/London"). Defaults to browser default.`,
  )
  .option(
    `--latitude <latitude>`,
    `Geolocation latitude. Pass a number between -90 to 90. Defaults to 0.`,
    parseInteger,
  )
  .option(
    `--longitude <longitude>`,
    `Geolocation longitude. Pass a number between -180 to 180. Defaults to 0.`,
    parseInteger,
  )
  .option(
    `--accuracy <accuracy>`,
    `Geolocation accuracy in meters. Pass a number between 0 to 100000. Defaults to 0.`,
    parseInteger,
  )
  .option(
    `--touch [value]`,
    `Enable touch support. Pass 0 for no touch, or 1 for touch enabled. Defaults to 0.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--permissions [permissions...]`,
    `Browser permissions to grant. Pass an array of permission names like ["geolocation", "camera", "microphone"]. Defaults to empty.`,
  )
  .option(
    `--sleep <sleep>`,
    `Wait time in seconds before taking the screenshot. Pass an integer between 0 to 10. Defaults to 0.`,
    parseInteger,
  )
  .option(
    `--width <width>`,
    `Output image width. Pass 0 to use original width, or an integer between 1 to 2000. Defaults to 0 (original width).`,
    parseInteger,
  )
  .option(
    `--height <height>`,
    `Output image height. Pass 0 to use original height, or an integer between 1 to 2000. Defaults to 0 (original height).`,
    parseInteger,
  )
  .option(
    `--quality <quality>`,
    `Screenshot quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`,
    parseInteger,
  )
  .option(
    `--output <output>`,
    `Output format type (jpeg, jpg, png, gif and webp).`,
  )
  .action(
    actionRunner(
      async ({
        url,
        headers,
        viewportWidth,
        viewportHeight,
        scale,
        theme,
        userAgent,
        fullpage,
        locale,
        timezone,
        latitude,
        longitude,
        accuracy,
        touch,
        permissions,
        sleep,
        width,
        height,
        quality,
        output,
      }) =>
        await (
          await getAvatarsClient()
        ).getScreenshot(
          url,
          JSON.parse(headers),
          viewportWidth,
          viewportHeight,
          scale,
          theme,
          userAgent,
          fullpage,
          locale,
          timezone,
          latitude,
          longitude,
          accuracy,
          touch,
          permissions,
          sleep,
          width,
          height,
          quality,
          output as ImageFormat,
        ),
    ),
  );
