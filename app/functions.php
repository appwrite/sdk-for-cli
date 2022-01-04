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
    ->param('search', '' , new Wildcard() , 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of functions to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the function used as the starting point for the query, excluding the function itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
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
        $path   = str_replace([], [], '/functions');
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
    ->label('description', "Create a new function. You can pass a list of [permissions](/docs/permissions) to allow different project users or team with access to execute the function using the client API.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID. Choose your own unique ID or pass the string `unique()` to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.',  false)
    ->param('name', '' , new Wildcard() , 'Function name. Max length: 128 chars.',  false)
    ->param('execute', '' , new Wildcard() , 'An array of strings with execution permissions. By default no user is granted with any execute permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->param('runtime', '' , new Wildcard() , 'Execution runtime.',  false)
    ->param('vars', [] , new Wildcard() , 'Key-value JSON object that will be passed to the function as environment variables.',  true)
    ->param('events', [] , new Wildcard() , 'Events list.',  true)
    ->param('schedule', '' , new Wildcard() , 'Schedule CRON syntax.',  true)
    ->param('timeout', 15 , new Wildcard() , 'Function maximum execution time in seconds.',  true)
    ->action(function ( $functionId, $name, $execute, $runtime, $vars, $events, $schedule, $timeout ) use ($parser) {
        /** @var string $functionId */
        /** @var string $name */
        /** @var array $execute */
        /** @var string $runtime */
        /** @var object $vars */
        /** @var array $events */
        /** @var string $schedule */
        /** @var integer $timeout */

        $client = new Client();
        $path   = str_replace([], [], '/functions');
        $params = [];
        /** Body Params */
        $params['functionId'] = $functionId;
        $params['name'] = $name;
        $params['execute'] = !is_array($execute) ? array($execute) : $execute;
        $params['runtime'] = $runtime;
        $params['vars'] = \json_decode($vars);
        $params['events'] = !is_array($events) ? array($events) : $events;
        $params['schedule'] = $schedule;
        $params['timeout'] = (int)$timeout;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listRuntimes')
    ->label('description', "Get a list of all runtimes that are currently active in your project.\n\n")
    ->action(function ( ) use ($parser) {

        $client = new Client();
        $path   = str_replace([], [], '/functions/runtimes');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('get')
    ->label('description', "Get a function by its unique ID.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->action(function ( $functionId ) use ($parser) {
        /** @var string $functionId */

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
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('name', '' , new Wildcard() , 'Function name. Max length: 128 chars.',  false)
    ->param('execute', '' , new Wildcard() , 'An array of strings with execution permissions. By default no user is granted with any execute permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->param('vars', [] , new Wildcard() , 'Key-value JSON object that will be passed to the function as environment variables.',  true)
    ->param('events', [] , new Wildcard() , 'Events list.',  true)
    ->param('schedule', '' , new Wildcard() , 'Schedule CRON syntax.',  true)
    ->param('timeout', 15 , new Wildcard() , 'Maximum execution time in seconds.',  true)
    ->action(function ( $functionId, $name, $execute, $vars, $events, $schedule, $timeout ) use ($parser) {
        /** @var string $functionId */
        /** @var string $name */
        /** @var array $execute */
        /** @var object $vars */
        /** @var array $events */
        /** @var string $schedule */
        /** @var integer $timeout */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}');
        $params = [];
        /** Body Params */
        $params['name'] = $name;
        $params['execute'] = !is_array($execute) ? array($execute) : $execute;
        $params['vars'] = \json_decode($vars);
        $params['events'] = !is_array($events) ? array($events) : $events;
        $params['schedule'] = $schedule;
        $params['timeout'] = (int)$timeout;
        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('delete')
    ->label('description', "Delete a function by its unique ID.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->action(function ( $functionId ) use ($parser) {
        /** @var string $functionId */

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
    ->label('description', "Get a list of all the current user function execution logs. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's executions. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of executions to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('search', '' , new Wildcard() , 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the execution used as the starting point for the query, excluding the execution itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursorDirection', 'after' , new Wildcard() , 'Direction of the cursor.',  true)
    ->action(function ( $functionId, $limit, $offset, $search, $cursor, $cursorDirection ) use ($parser) {
        /** @var string $functionId */
        /** @var integer $limit */
        /** @var integer $offset */
        /** @var string $search */
        /** @var string $cursor */
        /** @var string $cursorDirection */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/executions');
        $params = [];
        /** Query Params */
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['search'] = $search;
        $params['cursor'] = $cursor;
        $params['cursorDirection'] = $cursorDirection;
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createExecution')
    ->label('description', "Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('data', '' , new Wildcard() , 'String of custom data to send to function.',  true)
    ->action(function ( $functionId, $data ) use ($parser) {
        /** @var string $functionId */
        /** @var string $data */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/executions');
        $params = [];
        /** Body Params */
        $params['data'] = $data;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getExecution')
    ->label('description', "Get a function execution log by its unique ID.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('executionId', '' , new Wildcard() , 'Execution ID.',  false)
    ->action(function ( $functionId, $executionId ) use ($parser) {
        /** @var string $functionId */
        /** @var string $executionId */

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
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('tag', '' , new Wildcard() , 'Tag ID.',  false)
    ->action(function ( $functionId, $tag ) use ($parser) {
        /** @var string $functionId */
        /** @var string $tag */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tag');
        $params = [];
        /** Body Params */
        $params['tag'] = $tag;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listTags')
    ->label('description', "Get a list of all the project's code tags. You can use the query params to filter your results.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('search', '' , new Wildcard() , 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of tags to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the tag used as the starting point for the query, excluding the tag itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursorDirection', 'after' , new Wildcard() , 'Direction of the cursor.',  true)
    ->param('orderType', 'ASC' , new Wildcard() , 'Order result by ASC or DESC order.',  true)
    ->action(function ( $functionId, $search, $limit, $offset, $cursor, $cursorDirection, $orderType ) use ($parser) {
        /** @var string $functionId */
        /** @var string $search */
        /** @var integer $limit */
        /** @var integer $offset */
        /** @var string $cursor */
        /** @var string $cursorDirection */
        /** @var string $orderType */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tags');
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
    ->task('createTag')
    ->label('description', "Create a new function code tag. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's tag to use your new tag UID.

This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](/docs/functions).

Use the 'command' param to set the entry point used to execute your code.\n\n")
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('command', '' , new Wildcard() , 'Code execution command.',  false)
    ->param('code', '' , new Wildcard() , 'Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.',  false)
    ->action(function ( $functionId, $command, $code ) use ($parser) {
        /** @var string $functionId */
        /** @var string $command */
        /** @var file $code */

        $client = new Client();
        $path   = str_replace(['{functionId}'], [$functionId], '/functions/{functionId}/tags');
        $params = [];
        /** Body Params */
        $params['command'] = $command;
        $code = \urldecode($code);
        $cloudFunctionPath = realpath(__DIR__.'/../files/'.$code);
        $cloudFunctionParentDir = escapeshellarg(dirname($cloudFunctionPath, 1));
        $cloudFunctionDirName = escapeshellarg(basename($cloudFunctionPath));
        if (file_exists($cloudFunctionPath) === false ) {
            throw new Exception("Path doesn't exist. Please ensure that the path is within the current directory. "); 
        }
        $archiveName = 'code.tar.gz';
        $volumeMountPoint = realpath(__DIR__.'/../files/');
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
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('tagId', '' , new Wildcard() , 'Tag ID.',  false)
    ->action(function ( $functionId, $tagId ) use ($parser) {
        /** @var string $functionId */
        /** @var string $tagId */

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
    ->param('functionId', '' , new Wildcard() , 'Function ID.',  false)
    ->param('tagId', '' , new Wildcard() , 'Tag ID.',  false)
    ->action(function ( $functionId, $tagId ) use ($parser) {
        /** @var string $functionId */
        /** @var string $tagId */

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
                "listRuntimes" => "Get a list of all runtimes that are currently active in your project.",
                "get" => "Get a function by its unique ID.",
                "update" => "Update function by its unique ID.",
                "delete" => "Delete a function by its unique ID.",
                "listExecutions" => "Get a list of all the current user function execution logs. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's executions. [Learn more about different API modes](/docs/admin).",
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
