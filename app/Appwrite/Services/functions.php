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
            Console::log("\nUsage : appwrite functions {$taskName} --[OPTIONS] \n");
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
    ->label('description', "Get a list of all the project's functions. You can use the query params to filter your results.\n\n")
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/functions');
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
    ->label('description', "Create a new function. You can pass a list of [permissions](/docs/permissions) to allow different project users or team with access to execute the function using the client API.\n\n")
    ->param('name', '' , new Mock(), 'Function name. Max length: 128 chars.',  false)
    ->param('execute', '' , new Mock(), 'An array of strings with execution permissions. By default no user is granted with any execute permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('env', '' , new Mock(), 'Execution enviornment.',  false)
    ->param('vars', [] , new Mock(), 'Key-value JSON object.',  true)
    ->param('events', [] , new Mock(), 'Events list.',  true)
    ->param('schedule', '' , new Mock(), 'Schedule CRON syntax.',  true)
    ->param('timeout', 15 , new Mock(), 'Function maximum execution time in seconds.',  true)
    ->action(function ( $name, $execute, $env, $vars, $events, $schedule, $timeout ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/functions');
        $params = [];
        $params['name'] = $name;
        $params['execute'] = $execute;
        $params['env'] = $env;
        $params['vars'] = $vars;
        $params['events'] = $events;
        $params['schedule'] = $schedule;
        $params['timeout'] = $timeout;

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('get')
    ->label('description', "Get a function by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->action(function ( $functionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}');
        $params = [];

        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('update')
    ->label('description', "Update function by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('name', '' , new Mock(), 'Function name. Max length: 128 chars.',  false)
    ->param('execute', '' , new Mock(), 'An array of strings with execution permissions. By default no user is granted with any execute permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('vars', [] , new Mock(), 'Key-value JSON object.',  true)
    ->param('events', [] , new Mock(), 'Events list.',  true)
    ->param('schedule', '' , new Mock(), 'Schedule CRON syntax.',  true)
    ->param('timeout', 15 , new Mock(), 'Function maximum execution time in seconds.',  true)
    ->action(function ( $functionId, $name, $execute, $vars, $events, $schedule, $timeout ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}');
        $params = [];
        $params['name'] = $name;
        $params['execute'] = $execute;
        $params['vars'] = $vars;
        $params['events'] = $events;
        $params['schedule'] = $schedule;
        $params['timeout'] = $timeout;

        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('delete')
    ->label('description', "Delete a function by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->action(function ( $functionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}');
        $params = [];

        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listExecutions')
    ->label('description', "Get a list of all the current user function execution logs. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's teams. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $functionId, $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/executions');
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
    ->task('createExecution')
    ->label('description', "Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->action(function ( $functionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/executions');
        $params = [];

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getExecution')
    ->label('description', "Get a function execution log by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('executionId', '' , new Mock(), 'Execution unique ID.',  false)
    ->action(function ( $functionId, $executionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}', '{executionId}'], [$functionId, $executionId], '/functions/{functionId}/executions/{executionId}');
        $params = [];

        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updateTag')
    ->label('description', "Update the function code tag ID using the unique function ID. Use this endpoint to switch the code tag that should be executed by the execution endpoint.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('tag', '' , new Mock(), 'Tag unique ID.',  false)
    ->action(function ( $functionId, $tag ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tag');
        $params = [];
        $params['tag'] = $tag;

        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listTags')
    ->label('description', "Get a list of all the project's code tags. You can use the query params to filter your results.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $functionId, $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tags');
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
    ->task('createTag')
    ->label('description', "Create a new function code tag. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's tag to use your new tag UID.

This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](/docs/functions).

Use the 'command' param to set the entry point used to execute your code.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('command', '' , new Mock(), 'Code execution command.',  false)
    ->param('code', '' , new Mock(), 'Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.',  false)
    ->action(function ( $functionId, $command, $code ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tags');
        $params = [];
        $params['command'] = $command;
        $cloudFunctionPath = realpath(__DIR__.'/../../../files/'.$code);
        $cloudFunctionParentDir = dirname($cloudFunctionPath, 1);
        $cloudFunctionDirName = basename($cloudFunctionPath);
        if (file_exists($cloudFunctionPath) === false ) {
            throw new Exception("Path doesn't exist. Please ensure that the path is within the current directory. "); 
        }
        $archiveName = 'code.tar.gz';
        $volumeMountPoint = realpath(__DIR__.'/../../../files/');
        exec("tar -zcvf $archiveName -C $cloudFunctionParentDir $cloudFunctionDirName && mv $archiveName $volumeMountPoint");
        $archivePath = realpath($volumeMountPoint."/$archiveName");
        $cFile = new \CURLFile($archivePath,  'application/x-gzip' , basename($archivePath));
        $params['code'] = $cFile;

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'multipart/form-data',
        ], $params);
        $parser->parseResponse($response);
        unlink($archivePath);
    });

$cli
    ->task('getTag')
    ->label('description', "Get a code tag by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('tagId', '' , new Mock(), 'Tag unique ID.',  false)
    ->action(function ( $functionId, $tagId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}', '{tagId}'], [$functionId, $tagId], '/functions/{functionId}/tags/{tagId}');
        $params = [];

        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteTag')
    ->label('description', "Delete a code tag by its unique ID.\n\n")
    ->param('functionId', '' , new Mock(), 'Function unique ID.',  false)
    ->param('tagId', '' , new Mock(), 'Tag unique ID.',  false)
    ->action(function ( $functionId, $tagId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{functionId}', '{tagId}'], [$functionId, $tagId], '/functions/{functionId}/tags/{tagId}');
        $params = [];

        $response =  $client->call(Client::METHOD_DELETE, $path, [
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
        Console::log("\nUsage : appwrite functions [COMMAND]\n");
        Console::log("Commands :");
        $commands = [
                "list" => "Get a list of all the project's functions. You can use the query params to filter your results.",
                "create" => "Create a new function. You can pass a list of [permissions](/docs/permissions) to allow different project users or team with access to execute the function using the client API.",
                "get" => "Get a function by its unique ID.",
                "update" => "Update function by its unique ID.",
                "delete" => "Delete a function by its unique ID.",
                "listExecutions" => "Get a list of all the current user function execution logs. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's teams. [Learn more about different API modes](/docs/admin).",
                "createExecution" => "Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.",
                "getExecution" => "Get a function execution log by its unique ID.",
                "updateTag" => "Update the function code tag ID using the unique function ID. Use this endpoint to switch the code tag that should be executed by the execution endpoint.",
                "listTags" => "Get a list of all the project's code tags. You can use the query params to filter your results.",
                "createTag" => "Create a new function code tag. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's tag to use your new tag UID.

This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](/docs/functions).

Use the 'command' param to set the entry point used to execute your code.",
                "getTag" => "Get a code tag by its unique ID.",
                "deleteTag" => "Delete a code tag by its unique ID.",
        ];
        $parser->formatArray($commands);
        Console::log("\nRun 'appwrite functions COMMAND --help' for more information on a command.");
    });


$cli->run();
