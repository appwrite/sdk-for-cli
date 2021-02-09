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

            printf("\nUsage : appwrite locale {$taskName} --[OPTIONS] \n\n");
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
    ->task('get')
    ->label('description', "Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.

([IP Geolocation by DB-IP](https://db-ip.com))\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getContinents')
    ->label('description', "List of all continents. You can use the locale header to get the data in a supported language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/continents');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCountries')
    ->label('description', "List of all countries. You can use the locale header to get the data in a supported language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/countries');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCountriesEU')
    ->label('description', "List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/countries/eu');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCountriesPhones')
    ->label('description', "List of all countries phone codes. You can use the locale header to get the data in a supported language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/countries/phones');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCurrencies')
    ->label('description', "List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/currencies');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getLanguages')
    ->label('description', "List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/locale/languages');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


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
        printf("\nUsage : appwrite locale [COMMAND]\n\n");
        printf("Commands :\n");
        $mask = "\t%-20.20s %-125.125s\n";
        printf($mask, "get", "Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.

([IP Geolocation by DB-IP](https://db-ip.com))");
        printf($mask, "getContinents", "List of all continents. You can use the locale header to get the data in a supported language.");
        printf($mask, "getCountries", "List of all countries. You can use the locale header to get the data in a supported language.");
        printf($mask, "getCountriesEU", "List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.");
        printf($mask, "getCountriesPhones", "List of all countries phone codes. You can use the locale header to get the data in a supported language.");
        printf($mask, "getCurrencies", "List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.");
        printf($mask, "getLanguages", "List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.");
        printf("\nRun 'appwrite locale COMMAND --help' for more information on a command.\n");
    });


$cli->run();