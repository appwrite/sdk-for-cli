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

            printf("\nUsage : appwrite health {$taskName} --[OPTIONS] \n\n");
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
    ->label('description', "Check the Appwrite HTTP server is up and responsive.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getAntiVirus')
    ->label('description', "Check the Appwrite Anti Virus server is up and connection is successful.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/anti-virus');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCache')
    ->label('description', "Check the Appwrite in-memory cache server is up and connection is successful.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/cache');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getDB')
    ->label('description', "Check the Appwrite database server is up and connection is successful.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/db');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueCertificates')
    ->label('description', "Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/certificates');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueFunctions')
    ->label('description', "\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/functions');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueLogs')
    ->label('description', "Get the number of logs that are waiting to be processed in the Appwrite internal queue server.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/logs');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueTasks')
    ->label('description', "Get the number of tasks that are waiting to be processed in the Appwrite internal queue server.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/tasks');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueUsage')
    ->label('description', "Get the number of usage stats that are waiting to be processed in the Appwrite internal queue server.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/usage');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getQueueWebhooks')
    ->label('description', "Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/queue/webhooks');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getStorageLocal')
    ->label('description', "Check the Appwrite local storage device is up and connection is successful.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/storage/local');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getTime')
    ->label('description', "Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.\n\n")
    ->action(function ( ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/health/time');
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
        printf("\nUsage : appwrite health [COMMAND]\n\n");
        printf("Commands :\n");
        $mask = "\t%-20.20s %-125.125s\n";
        printf($mask, "get", "Check the Appwrite HTTP server is up and responsive.");
        printf($mask, "getAntiVirus", "Check the Appwrite Anti Virus server is up and connection is successful.");
        printf($mask, "getCache", "Check the Appwrite in-memory cache server is up and connection is successful.");
        printf($mask, "getDB", "Check the Appwrite database server is up and connection is successful.");
        printf($mask, "getQueueCertificates", "Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.");
        printf($mask, "getQueueFunctions", "");
        printf($mask, "getQueueLogs", "Get the number of logs that are waiting to be processed in the Appwrite internal queue server.");
        printf($mask, "getQueueTasks", "Get the number of tasks that are waiting to be processed in the Appwrite internal queue server.");
        printf($mask, "getQueueUsage", "Get the number of usage stats that are waiting to be processed in the Appwrite internal queue server.");
        printf($mask, "getQueueWebhooks", "Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.");
        printf($mask, "getStorageLocal", "Check the Appwrite local storage device is up and connection is successful.");
        printf($mask, "getTime", "Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.");
        printf("\nRun 'appwrite health COMMAND --help' for more information on a command.\n");
    });


$cli->run();