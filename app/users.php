<?php

namespace Appwrite\Services;

require_once './vendor/autoload.php';

use Exception;
use Appwrite\Client;
use Appwrite\Parser;
use Utopia\CLI\CLI;
use Utopia\CLI\Console;
use Utopia\Validator\Wildcard;

$parser = new Parser();
$cli = new CLI();

$cli->
      init(function() use ($cli, $parser) {
        
        if (array_key_exists('help', $cli->getArgs())) {
            $taskName = $cli->match()->getName();
            $task = $cli->getTasks()[$taskName];
            $description = $task->getLabel('description', '');
            $params = $task->getParams();

            Console::log("\e[0;31;m 
    _                            _ _           ___   __   _____ 
   /_\  _ __  _ ____      ___ __(_) |_ ___    / __\ / /   \_   \
  //_\| '_ \| '_ \ \ /\ / / '__| | __/ _ \  / /   / /     / /\/
 /  _  \ |_) | |_) \ V  V /| |  | | ||  __/ / /___/ /___/\/ /_  
 \_/ \_/ .__/| .__/ \_/\_/ |_|  |_|\__\___| \____/\____/\____/  
       |_|   |_|                                                  
  \e[0m") ;
            Console::log("\nUsage : appwrite users {$taskName} --[OPTIONS] \n");
            Console::log($description);
            Console::log("Options:");
            array_walk($params, function(&$key) {
                $key = $key['description'];
            });
            $parser->formatArray($params);
            Console::exit(0);
        }
      });

$cli
    ->task('list')
    ->label('description', "Get a list of all the project's users. You can use the query params to filter your results.\n\n")
    ->param('search', '' , new Wildcard() , 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of users to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the user used as the starting point for the query, excluding the user itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursorDirection', 'after' , new Wildcard() , 'Direction of the cursor.',  true)
    ->param('orderType', 'ASC' , new Wildcard() , 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $cursor, $cursorDirection, $orderType ) use ($parser) {
        /** @var string $search */
        /** @var integer $limit */
        /** @var integer $offset */
        /** @var string $cursor */
        /** @var string $cursorDirection */
        /** @var string $orderType */

        $client = new Client();
        $path   = str_replace([], [], '/users');
        $params = [];
        /** Query Params */
        $params['search'] = $search;
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['cursor'] = $cursor;
        $params['cursorDirection'] = $cursorDirection;
        $params['orderType'] = $orderType;
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('create')
    ->label('description', "Create a new user.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID. Choose your own unique ID or pass the string `unique()` to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.',  false)
    ->param('email', '' , new Wildcard() , 'User email.',  false)
    ->param('password', '' , new Wildcard() , 'User password. Must be at least 8 chars.',  false)
    ->param('name', '' , new Wildcard() , 'User name. Max length: 128 chars.',  true)
    ->action(function ( $userId, $email, $password, $name ) use ($parser) {
        /** @var string $userId */
        /** @var string $email */
        /** @var string $password */
        /** @var string $name */

        $client = new Client();
        $path   = str_replace([], [], '/users');
        $params = [];
        /** Body Params */
        $params['userId'] = $userId;
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
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        /** @var string $userId */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('delete')
    ->label('description', "Delete a user by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        /** @var string $userId */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}');
        $params = [];
        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updateEmail')
    ->label('description', "Update the user email by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('email', '' , new Wildcard() , 'User email.',  false)
    ->action(function ( $userId, $email ) use ($parser) {
        /** @var string $userId */
        /** @var string $email */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/email');
        $params = [];
        /** Body Params */
        $params['email'] = $email;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getLogs')
    ->label('description', "Get the user activity logs list by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->action(function ( $userId, $limit, $offset ) use ($parser) {
        /** @var string $userId */
        /** @var integer $limit */
        /** @var integer $offset */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/logs');
        $params = [];
        /** Query Params */
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updateName')
    ->label('description', "Update the user name by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('name', '' , new Wildcard() , 'User name. Max length: 128 chars.',  false)
    ->action(function ( $userId, $name ) use ($parser) {
        /** @var string $userId */
        /** @var string $name */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/name');
        $params = [];
        /** Body Params */
        $params['name'] = $name;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updatePassword')
    ->label('description', "Update the user password by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('password', '' , new Wildcard() , 'New user password. Must be at least 8 chars.',  false)
    ->action(function ( $userId, $password ) use ($parser) {
        /** @var string $userId */
        /** @var string $password */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/password');
        $params = [];
        /** Body Params */
        $params['password'] = $password;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getPrefs')
    ->label('description', "Get the user preferences by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        /** @var string $userId */

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
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('prefs', '' , new Wildcard() , 'Prefs key-value JSON object.',  false)
    ->action(function ( $userId, $prefs ) use ($parser) {
        /** @var string $userId */
        /** @var object $prefs */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/prefs');
        $params = [];
        /** Body Params */
        $params['prefs'] = \json_decode($prefs);
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getSessions')
    ->label('description', "Get the user sessions list by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        /** @var string $userId */

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
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->action(function ( $userId ) use ($parser) {
        /** @var string $userId */

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
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('sessionId', '' , new Wildcard() , 'Session ID.',  false)
    ->action(function ( $userId, $sessionId ) use ($parser) {
        /** @var string $userId */
        /** @var string $sessionId */

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
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('status', '' , new Wildcard() , 'User Status. To activate the user pass `true` and to block the user pass `false`.',  false)
    ->action(function ( $userId, $status ) use ($parser) {
        /** @var string $userId */
        /** @var boolean $status */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/status');
        $params = [];
        /** Body Params */
        $params['status'] = $status;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updateVerification')
    ->label('description', "Update the user email verification status by its unique ID.\n\n")
    ->param('userId', '' , new Wildcard() , 'User ID.',  false)
    ->param('emailVerification', '' , new Wildcard() , 'User email verification status.',  false)
    ->action(function ( $userId, $emailVerification ) use ($parser) {
        /** @var string $userId */
        /** @var boolean $emailVerification */

        $client = new Client();
        $path   = str_replace(['{userId}'], [$userId], '/users/{userId}/verification');
        $params = [];
        /** Body Params */
        $params['emailVerification'] = $emailVerification;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });


$cli
    ->task('help')
    ->action(function() use ($parser) {
        Console::log("\e[0;31;m 
    _                            _ _           ___   __   _____ 
   /_\  _ __  _ ____      ___ __(_) |_ ___    / __\ / /   \_   \
  //_\| '_ \| '_ \ \ /\ / / '__| | __/ _ \  / /   / /     / /\/
 /  _  \ |_) | |_) \ V  V /| |  | | ||  __/ / /___/ /___/\/ /_  
 \_/ \_/ .__/| .__/ \_/\_/ |_|  |_|\__\___| \____/\____/\____/  
       |_|   |_|                                                  
  \e[0m");
        Console::log("\nUsage : appwrite users [COMMAND]\n");
        Console::log("Commands :");
        $commands = [
                "list" => "Get a list of all the project's users. You can use the query params to filter your results.",
                "create" => "Create a new user.",
                "get" => "Get a user by its unique ID.",
                "delete" => "Delete a user by its unique ID.",
                "updateEmail" => "Update the user email by its unique ID.",
                "getLogs" => "Get the user activity logs list by its unique ID.",
                "updateName" => "Update the user name by its unique ID.",
                "updatePassword" => "Update the user password by its unique ID.",
                "getPrefs" => "Get the user preferences by its unique ID.",
                "updatePrefs" => "Update the user preferences by its unique ID. You can pass only the specific settings you wish to update.",
                "getSessions" => "Get the user sessions list by its unique ID.",
                "deleteSessions" => "Delete all user's sessions by using the user's unique ID.",
                "deleteSession" => "Delete a user sessions by its unique ID.",
                "updateStatus" => "Update the user status by its unique ID.",
                "updateVerification" => "Update the user email verification status by its unique ID.",
        ];
        $parser->formatArray($commands);
        Console::log("\nRun 'appwrite users COMMAND --help' for more information on a command.");
    });


$cli->run();
