<?php

namespace Appwrite\Services;

require_once './vendor/autoload.php';

use Exception;
use Appwrite\Client;
use Appwrite\Parser;
use Utopia\CLI\CLI;
use Utopia\CLI\Console;
use Utopia\Validator\Mock;

$parser = new Parser();

$cli = new CLI();

$cli->
      init(function() use ($cli) {
        
        if (array_key_exists('help', $cli->getArgs())) {
            $taskName = $cli->match()->getName();
            $task = $cli->getTasks()[$taskName];
            $description = $task->getLabel('description', '');
            $params = $task->getParams();

            echo "\e[0;31;m
   _                            _ _       
  /_\  _ __  _ ____      ___ __(_) |_ ___ 
 //_\\| '_ \| '_ \ \ /\ / / '__| | __/ _ \
/  _  \ |_) | |_) \ V  V /| |  | | ||  __/
\_/ \_/ .__/| .__/ \_/\_/ |_|  |_|\__\___|
      |_|   |_|                           
      
      \e[0m" ;

            printf("\nUsage : appwrite avatars {$taskName} --[OPTIONS] \n\n");
            printf($description);
            printf("Options:\n");
            $mask = "\t%-20.20s %-125.125s\n";

            foreach ($params as $key => $value) {
                if ($key !== 'help')
                    printf($mask, $key, $value['description']);
            }
            Console::exit(0);
        }
      });

$cli
    ->task('getBrowser')
    ->label('description', "You can use this endpoint to show different browser icons to your users. The code argument receives the browser code as it appears in your user /account/sessions endpoint. Use width, height and quality arguments to change the output settings.\n\n")
    ->param('code', '' , new Mock(), 'Browser Code.',  false)
    ->param('width', 100 , new Mock(), 'Image width. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('height', 100 , new Mock(), 'Image height. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('quality', 100 , new Mock(), 'Image quality. Pass an integer between 0 to 100. Defaults to 100.',  true)
    ->action(function ( $code, $width, $height, $quality ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{code}'], [$code], '/avatars/browsers/{code}');
        $params = [];

        $params['width'] = $width;
        $params['height'] = $height;
        $params['quality'] = $quality;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getCreditCard')
    ->label('description', "The credit card endpoint will return you the icon of the credit card provider you need. Use width, height and quality arguments to change the output settings.\n\n")
    ->param('code', '' , new Mock(), 'Credit Card Code. Possible values: amex, argencard, cabal, censosud, diners, discover, elo, hipercard, jcb, mastercard, naranja, targeta-shopping, union-china-pay, visa, mir, maestro.',  false)
    ->param('width', 100 , new Mock(), 'Image width. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('height', 100 , new Mock(), 'Image height. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('quality', 100 , new Mock(), 'Image quality. Pass an integer between 0 to 100. Defaults to 100.',  true)
    ->action(function ( $code, $width, $height, $quality ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{code}'], [$code], '/avatars/credit-cards/{code}');
        $params = [];

        $params['width'] = $width;
        $params['height'] = $height;
        $params['quality'] = $quality;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getFavicon')
    ->label('description', "Use this endpoint to fetch the favorite icon (AKA favicon) of any remote website URL.
\n\n")
    ->param('url', '' , new Mock(), 'Website URL which you want to fetch the favicon from.',  false)
    ->action(function ( $url ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/avatars/favicon');
        $params = [];

        $params['url'] = $url;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getFlag')
    ->label('description', "You can use this endpoint to show different country flags icons to your users. The code argument receives the 2 letter country code. Use width, height and quality arguments to change the output settings.\n\n")
    ->param('code', '' , new Mock(), 'Country Code. ISO Alpha-2 country code format.',  false)
    ->param('width', 100 , new Mock(), 'Image width. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('height', 100 , new Mock(), 'Image height. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('quality', 100 , new Mock(), 'Image quality. Pass an integer between 0 to 100. Defaults to 100.',  true)
    ->action(function ( $code, $width, $height, $quality ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{code}'], [$code], '/avatars/flags/{code}');
        $params = [];

        $params['width'] = $width;
        $params['height'] = $height;
        $params['quality'] = $quality;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getImage')
    ->label('description', "Use this endpoint to fetch a remote image URL and crop it to any image size you want. This endpoint is very useful if you need to crop and display remote images in your app or in case you want to make sure a 3rd party image is properly served using a TLS protocol.\n\n")
    ->param('url', '' , new Mock(), 'Image URL which you want to crop.',  false)
    ->param('width', 400 , new Mock(), 'Resize preview image width, Pass an integer between 0 to 2000.',  true)
    ->param('height', 400 , new Mock(), 'Resize preview image height, Pass an integer between 0 to 2000.',  true)
    ->action(function ( $url, $width, $height ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/avatars/image');
        $params = [];

        $params['url'] = $url;
        $params['width'] = $width;
        $params['height'] = $height;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getInitials')
    ->label('description', "Use this endpoint to show your user initials avatar icon on your website or app. By default, this route will try to print your logged-in user name or email initials. You can also overwrite the user name if you pass the 'name' parameter. If no name is given and no user is logged, an empty avatar will be returned.

You can use the color and background params to change the avatar colors. By default, a random theme will be selected. The random theme will persist for the user's initials when reloading the same theme will always return for the same initials.\n\n")
    ->param('name', '' , new Mock(), 'Full Name. When empty, current user name or email will be used. Max length: 128 chars.',  true)
    ->param('width', 500 , new Mock(), 'Image width. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('height', 500 , new Mock(), 'Image height. Pass an integer between 0 to 2000. Defaults to 100.',  true)
    ->param('color', '' , new Mock(), 'Changes text color. By default a random color will be picked and stay will persistent to the given name.',  true)
    ->param('background', '' , new Mock(), 'Changes background color. By default a random color will be picked and stay will persistent to the given name.',  true)
    ->action(function ( $name, $width, $height, $color, $background ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/avatars/initials');
        $params = [];

        $params['name'] = $name;
        $params['width'] = $width;
        $params['height'] = $height;
        $params['color'] = $color;
        $params['background'] = $background;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });

$cli
    ->task('getQR')
    ->label('description', "Converts a given plain text to a QR code image. You can use the query parameters to change the size and style of the resulting image.\n\n")
    ->param('text', '' , new Mock(), 'Plain text to be converted to QR code image.',  false)
    ->param('size', 400 , new Mock(), 'QR code size. Pass an integer between 0 to 1000. Defaults to 400.',  true)
    ->param('margin', 1 , new Mock(), 'Margin from edge. Pass an integer between 0 to 10. Defaults to 1.',  true)
    ->param('download', false , new Mock(), 'Return resulting image with &#039;Content-Disposition: attachment &#039; headers for the browser to start downloading it. Pass 0 for no header, or 1 for otherwise. Default value is set to 0.',  true)
    ->action(function ( $text, $size, $margin, $download ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/avatars/qr');
        $params = [];

        $params['text'] = $text;
        $params['size'] = $size;
        $params['margin'] = $margin;
        $params['download'] = $download;




        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        echo $path;


    });


$cli
    ->task('help')
    ->action(function() {
        echo "\e[0;31;m
   _                            _ _       
  /_\  _ __  _ ____      ___ __(_) |_ ___ 
 //_\\| '_ \| '_ \ \ /\ / / '__| | __/ _ \
/  _  \ |_) | |_) \ V  V /| |  | | ||  __/
\_/ \_/ .__/| .__/ \_/\_/ |_|  |_|\__\___|
      |_|   |_|                           
      
      \e[0m" ;
        printf("\nUsage : appwrite avatars [COMMAND]\n\n");
        printf("Commands :\n");
        $mask = "\t%-20.20s %-125.125s\n";
        printf($mask, "getBrowser", "You can use this endpoint to show different browser icons to your users. The code argument receives the browser code as it appears in your user /account/sessions endpoint. Use width, height and quality arguments to change the output settings.");
        printf($mask, "getCreditCard", "The credit card endpoint will return you the icon of the credit card provider you need. Use width, height and quality arguments to change the output settings.");
        printf($mask, "getFavicon", "Use this endpoint to fetch the favorite icon (AKA favicon) of any remote website URL.
");
        printf($mask, "getFlag", "You can use this endpoint to show different country flags icons to your users. The code argument receives the 2 letter country code. Use width, height and quality arguments to change the output settings.");
        printf($mask, "getImage", "Use this endpoint to fetch a remote image URL and crop it to any image size you want. This endpoint is very useful if you need to crop and display remote images in your app or in case you want to make sure a 3rd party image is properly served using a TLS protocol.");
        printf($mask, "getInitials", "Use this endpoint to show your user initials avatar icon on your website or app. By default, this route will try to print your logged-in user name or email initials. You can also overwrite the user name if you pass the 'name' parameter. If no name is given and no user is logged, an empty avatar will be returned.

You can use the color and background params to change the avatar colors. By default, a random theme will be selected. The random theme will persist for the user's initials when reloading the same theme will always return for the same initials.");
        printf($mask, "getQR", "Converts a given plain text to a QR code image. You can use the query parameters to change the size and style of the resulting image.");
        printf("\nRun 'appwrite avatars COMMAND --help' for more information on a command.\n");
    });


$cli->run();
