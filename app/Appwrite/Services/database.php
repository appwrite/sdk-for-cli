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

            printf("\nUsage : appwrite database {$taskName} --[OPTIONS] \n\n");
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
    ->task('listCollections')
    ->label('description', "Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's collections. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/database/collections');
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
    ->task('createCollection')
    ->label('description', "Create a new Collection.\n\n")
    ->param('name', '' , new Mock(), 'Collection name. Max length: 128 chars.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('rules', '' , new Mock(), 'Array of [rule objects](/docs/rules). Each rule define a collection field name, data type and validation.',  false)
    ->action(function ( $name, $read, $write, $rules ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/database/collections');
        $params = [];



 
        $params['name'] = $name;


 
        $params['read'] = $read;


 
        $params['write'] = $write;


 
        $params['rules'] = $rules;




        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getCollection')
    ->label('description', "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID.',  false)
    ->action(function ( $collectionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('updateCollection')
    ->label('description', "Update a collection by its unique ID.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID.',  false)
    ->param('name', '' , new Mock(), 'Collection name. Max length: 128 chars.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions(/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('rules', [] , new Mock(), 'Array of [rule objects](/docs/rules). Each rule define a collection field name, data type and validation.',  true)
    ->action(function ( $collectionId, $name, $read, $write, $rules ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}');
        $params = [];



 
        $params['name'] = $name;


 
        $params['read'] = $read;


 
        $params['write'] = $write;


 
        $params['rules'] = $rules;




        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('deleteCollection')
    ->label('description', "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID.',  false)
    ->action(function ( $collectionId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}');
        $params = [];





        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('listDocuments')
    ->label('description', "Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's documents. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID. You can create a new collection with validation rules using the Database service [server integration](/docs/server/database#createCollection).',  false)
    ->param('filters', [] , new Mock(), 'Array of filter strings. Each filter is constructed from a key name, comparison operator (=, !=, &gt;, &lt;, &lt;=, &gt;=) and a value. You can also use a dot (.) separator in attribute names to filter by child document attributes. Examples: &#039;name=John Doe&#039; or &#039;category.$id&gt;=5bed2d152c362&#039;.',  true)
    ->param('limit', 25 , new Mock(), 'Maximum number of documents to return in response.  Use this value to manage pagination. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Offset value. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderField', '' , new Mock(), 'Document field that results will be sorted by.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order direction. Possible values are DESC for descending order, or ASC for ascending order.',  true)
    ->param('orderCast', 'string' , new Mock(), 'Order field type casting. Possible values are int, string, date, time or datetime. The database will attempt to cast the order field to the value you pass here. The default value is a string.',  true)
    ->param('search', '' , new Mock(), 'Search query. Enter any free text search. The database will try to find a match against all document attributes and children. Max length: 256 chars.',  true)
    ->action(function ( $collectionId, $filters, $limit, $offset, $orderField, $orderType, $orderCast, $search ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/documents');
        $params = [];

        $params['filters'] = $filters;
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['orderField'] = $orderField;
        $params['orderType'] = $orderType;
        $params['orderCast'] = $orderCast;
        $params['search'] = $search;




        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('createDocument')
    ->label('description', "Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/database#databaseCreateCollection) API or directly from your database console.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID. You can create a new collection with validation rules using the Database service [server integration](/docs/server/database#createCollection).',  false)
    ->param('data', '' , new Mock(), 'Document data as JSON object.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('parentDocument', '' , new Mock(), 'Parent document unique ID. Use when you want your new document to be a child of a parent document.',  true)
    ->param('parentProperty', '' , new Mock(), 'Parent document property name. Use when you want your new document to be a child of a parent document.',  true)
    ->param('parentPropertyType', 'assign' , new Mock(), 'Parent document property connection type. You can set this value to **assign**, **append** or **prepend**, default value is assign. Use when you want your new document to be a child of a parent document.',  true)
    ->action(function ( $collectionId, $data, $read, $write, $parentDocument, $parentProperty, $parentPropertyType ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/documents');
        $params = [];



 
        $params['data'] = $data;


 
        $params['read'] = $read;


 
        $params['write'] = $write;


 
        $params['parentDocument'] = $parentDocument;


 
        $params['parentProperty'] = $parentProperty;


 
        $params['parentPropertyType'] = $parentPropertyType;




        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('getDocument')
    ->label('description', "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID. You can create a new collection with validation rules using the Database service [server integration](/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Mock(), 'Document unique ID.',  false)
    ->action(function ( $collectionId, $documentId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}', '{documentId}'], [$collectionId, $documentId], '/database/collections/{collectionId}/documents/{documentId}');
        $params = [];





        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('updateDocument')
    ->label('description', "Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID. You can create a new collection with validation rules using the Database service [server integration](/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Mock(), 'Document unique ID.',  false)
    ->param('data', '' , new Mock(), 'Document data as JSON object.',  false)
    ->param('read', '' , new Mock(), 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Mock(), 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](/docs/permissions) and get a full list of available permissions.',  false)
    ->action(function ( $collectionId, $documentId, $data, $read, $write ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}', '{documentId}'], [$collectionId, $documentId], '/database/collections/{collectionId}/documents/{documentId}');
        $params = [];



 
        $params['data'] = $data;


 
        $params['read'] = $read;


 
        $params['write'] = $write;




        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);


    });

$cli
    ->task('deleteDocument')
    ->label('description', "Delete a document by its unique ID. This endpoint deletes only the parent documents, its attributes and relations to other documents. Child documents **will not** be deleted.\n\n")
    ->param('collectionId', '' , new Mock(), 'Collection unique ID. You can create a new collection with validation rules using the Database service [server integration](/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Mock(), 'Document unique ID.',  false)
    ->action(function ( $collectionId, $documentId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{collectionId}', '{documentId}'], [$collectionId, $documentId], '/database/collections/{collectionId}/documents/{documentId}');
        $params = [];





        $response =  $client->call(Client::METHOD_DELETE, $path, [
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
        printf("\nUsage : appwrite database [COMMAND]\n\n");
        printf("Commands :\n");
        $mask = "\t%-20.20s %-125.125s\n";
        printf($mask, "listCollections", "Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's collections. [Learn more about different API modes](/docs/admin).");
        printf($mask, "createCollection", "Create a new Collection.");
        printf($mask, "getCollection", "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.");
        printf($mask, "updateCollection", "Update a collection by its unique ID.");
        printf($mask, "deleteCollection", "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.");
        printf($mask, "listDocuments", "Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's documents. [Learn more about different API modes](/docs/admin).");
        printf($mask, "createDocument", "Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/database#databaseCreateCollection) API or directly from your database console.");
        printf($mask, "getDocument", "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.");
        printf($mask, "updateDocument", "Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.");
        printf($mask, "deleteDocument", "Delete a document by its unique ID. This endpoint deletes only the parent documents, its attributes and relations to other documents. Child documents **will not** be deleted.");
        printf("\nRun 'appwrite database COMMAND --help' for more information on a command.\n");
    });


$cli->run();