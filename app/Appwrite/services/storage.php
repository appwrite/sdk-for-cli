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
            Console::log("\nUsage : appwrite storage {$taskName} --[OPTIONS] \n");
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
    ->task('listFiles')
    ->label('description', "Get a list of all the user files. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's files. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $orderType ) use ($parser) {        
        $client = new Client();
        $path   = str_replace([], [], '/storage/files');
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
    ->task('createFile')
    ->label('description', "Create a new file. The user who creates the file will automatically be assigned to read and write access unless he has passed custom values for read and write arguments.\n\n")
    ->param('file', '' , new Mock(), 'Binary file.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->action(function ( $file, $read, $write ) use ($parser) {        
        $client = new Client();
        $path   = str_replace([], [], '/storage/files');
        $params = [];
        $file = realpath(__DIR__.'/../../../files/'.$file);
        if (file_exists($file) === false ) {
            throw new Exception("Path doesn't exist. Please ensure that the path is within the current directory. "); 
        }
        $cFile = new \CURLFile($file,  'image/png' , basename($file));
        $params['file'] = $cFile;
        $params['read'] = $read;
        $params['write'] = $write;

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'multipart/form-data',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getFile')
    ->label('description', "Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID.',  false)
    ->action(function ( $fileId ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}');
        $params = [];

        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('updateFile')
    ->label('description', "Update a file by its unique ID. Only users with write permissions have access to update this resource.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->action(function ( $fileId, $read, $write ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}');
        $params = [];
        $params['read'] = $read;
        $params['write'] = $write;

        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteFile')
    ->label('description', "Delete a file by its unique ID. Only users with write permissions have access to delete this resource.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID.',  false)
    ->action(function ( $fileId ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}');
        $params = [];

        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getFileDownload')
    ->label('description', "Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID.',  false)
    ->action(function ( $fileId ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}/download');
        $params = [];
        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        Console::success($path);
    });

$cli
    ->task('getFilePreview')
    ->label('description', "Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID',  false)
    ->param('width', 0 , new Mock(), 'Resize preview image width, Pass an integer between 0 to 4000.',  true)
    ->param('height', 0 , new Mock(), 'Resize preview image height, Pass an integer between 0 to 4000.',  true)
    ->param('quality', 100 , new Mock(), 'Preview image quality. Pass an integer between 0 to 100. Defaults to 100.',  true)
    ->param('background', '' , new Mock(), 'Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.',  true)
    ->param('output', '' , new Mock(), 'Output format type (jpeg, jpg, png, gif and webp).',  true)
    ->action(function ( $fileId, $width, $height, $quality, $background, $output ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}/preview');
        $params = [];
        $params['width'] = $width;
        $params['height'] = $height;
        $params['quality'] = $quality;
        $params['background'] = $background;
        $params['output'] = $output;
        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        Console::success($path);
    });

$cli
    ->task('getFileView')
    ->label('description', "Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.\n\n")
    ->param('fileId', '' , new Mock(), 'File unique ID.',  false)
    ->action(function ( $fileId ) use ($parser) {        
        $client = new Client();
        $path   = str_replace(['{fileId}'], [$fileId], '/storage/files/{fileId}/view');
        $params = [];
        $params['project'] = $client->getPreference('X-Appwrite-Project');
        $params['key'] = $client->getPreference('X-Appwrite-Key');
        $path = $client->getPreference(Client::PREFERENCE_ENDPOINT).$path . "?" . http_build_query($params);
        Console::success($path);
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
        Console::log("\nUsage : appwrite storage [COMMAND]\n");
        Console::log("Commands :");
        $commands = [
                "listFiles" => "Get a list of all the user files. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's files. [Learn more about different API modes](/docs/admin).",
                "createFile" => "Create a new file. The user who creates the file will automatically be assigned to read and write access unless he has passed custom values for read and write arguments.",
                "getFile" => "Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.",
                "updateFile" => "Update a file by its unique ID. Only users with write permissions have access to update this resource.",
                "deleteFile" => "Delete a file by its unique ID. Only users with write permissions have access to delete this resource.",
                "getFileDownload" => "Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.",
                "getFilePreview" => "Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image.",
                "getFileView" => "Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.",
        ];
        $parser->formatArray($commands);
        Console::log("\nRun 'appwrite storage COMMAND --help' for more information on a command.");
    });


$cli->run();
