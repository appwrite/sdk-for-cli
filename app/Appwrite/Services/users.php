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

            printf("\nUsage : appwrite users {$taskName} --[OPTIONS] \n\n");
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
    ->task('list')
    ->label('description', "Get a list of all the project's users. You can use the query params to filter your results.\n\n")
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/users');
        $params = [];

        $params['search'] = $search;
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['orderType'] = $orderType;




        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('create')
    ->label('description', "Create a new user.\n\n")
    ->param('email', '' , new Mock(), 'User email.',  false)
    ->param('password', '' , new Mock(), 'User password. Must be between 6 to 32 chars.',  false)
    ->param('name', '' , new Mock(), 'User name. Max length: 128 chars.',  true)
    ->action(function ( $email, $password, $name ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/users');
        $params = [];



 
        $params['email'] = $email;


 
        $params['password'] = $password;


 
        $params['name'] = $name;




        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('get')
    ->label('description', "Get a user by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('deleteUser')
    ->label('description', "Delete a user by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}');
        $params = [];





        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getLogs')
    ->label('description', "Get a user activity logs list by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/logs');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getPrefs')
    ->label('description', "Get the user preferences by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/prefs');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('updatePrefs')
    ->label('description', "Update the user preferences by its unique ID. You can pass only the specific settings you wish to update.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->param('prefs', '' , new Mock(), 'Prefs key-value JSON object.',  false)
    ->action(function ( $userId, $prefs ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/prefs');
        $params = [];



 
        $params['prefs'] = $prefs;




        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getSessions')
    ->label('description', "Get the user sessions list by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/sessions');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('deleteSessions')
    ->label('description', "Delete all user's sessions by using the user's unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/sessions');
        $params = [];





        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('deleteSession')
    ->label('description', "Delete a user sessions by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->param('sessionId', '' , new Mock(), 'User unique session ID.',  false)
    ->action(function ( $userId, $sessionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}', '{sessionId}'], [$userId, $sessionId], '/users/{userId}/sessions/{sessionId}');
        $params = [];





        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('updateStatus')
    ->label('description', "Update the user status by its unique ID.\n\n")
    ->param('userId', '' , new Mock(), 'User unique ID.',  false)
    ->param('status', '' , new Mock(), 'User Status code. To activate the user pass 1, to block the user pass 2 and for disabling the user pass 0',  false)
    ->action(function ( $userId, $status ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/status');
        $params = [];



 
        $params['status'] = $status;




        $response =  $client->call(Client::METHOD_PATCH, $path, [
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
        printf("\nUsage : appwrite users [COMMAND]\n\n");
        printf("Commands :\n");
        $mask = "\t%-20.20s %-125.125s\n";
        printf($mask, "list", "Get a list of all the project's users. You can use the query params to filter your results.");
        printf($mask, "create", "Create a new user.");
        printf($mask, "get", "Get a user by its unique ID.");
        printf($mask, "deleteUser", "Delete a user by its unique ID.");
        printf($mask, "getLogs", "Get a user activity logs list by its unique ID.");
        printf($mask, "getPrefs", "Get the user preferences by its unique ID.");
        printf($mask, "updatePrefs", "Update the user preferences by its unique ID. You can pass only the specific settings you wish to update.");
        printf($mask, "getSessions", "Get the user sessions list by its unique ID.");
        printf($mask, "deleteSessions", "Delete all user's sessions by using the user's unique ID.");
        printf($mask, "deleteSession", "Delete a user sessions by its unique ID.");
        printf($mask, "updateStatus", "Update the user status by its unique ID.");
        printf("\nRun 'appwrite users COMMAND --help' for more information on a command.\n");
    });


$cli->run();
