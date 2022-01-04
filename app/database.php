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
            Console::log("\nUsage : appwrite database {$taskName} --[OPTIONS] \n");
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
    ->task('listCollections')
    ->label('description', "Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's collections. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('search', '' , new Wildcard() , 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of collection to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the collection used as the starting point for the query, excluding the collection itself. Should be used for efficient pagination when working with large sets of data.',  true)
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
        $path   = str_replace([], [], '/database/collections');
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
    ->task('createCollection')
    ->label('description', "Create a new Collection.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Unique Id. Choose your own unique ID or pass the string `unique()` to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.',  false)
    ->param('name', '' , new Wildcard() , 'Collection name. Max length: 128 chars.',  false)
    ->param('permission', '' , new Wildcard() , 'Permissions type model to use for reading documents in this collection. You can use collection-level permission set once on the collection using the `read` and `write` params, or you can set document-level permission where each document read and write params will decide who has access to read and write to each document individually. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->param('read', '' , new Wildcard() , 'An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->param('write', '' , new Wildcard() , 'An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->action(function ( $collectionId, $name, $permission, $read, $write ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $name */
        /** @var string $permission */
        /** @var array $read */
        /** @var array $write */

        $client = new Client();
        $path   = str_replace([], [], '/database/collections');
        $params = [];
        /** Body Params */
        $params['collectionId'] = $collectionId;
        $params['name'] = $name;
        $params['permission'] = $permission;
        $params['read'] = !is_array($read) ? array($read) : $read;
        $params['write'] = !is_array($write) ? array($write) : $write;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getCollection')
    ->label('description', "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID.',  false)
    ->action(function ( $collectionId ) use ($parser) {
        /** @var string $collectionId */

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
    ->param('collectionId', '' , new Wildcard() , 'Collection ID.',  false)
    ->param('name', '' , new Wildcard() , 'Collection name. Max length: 128 chars.',  false)
    ->param('permission', '' , new Wildcard() , 'Permissions type model to use for reading documents in this collection. You can use collection-level permission set once on the collection using the `read` and `write` params, or you can set document-level permission where each document read and write params will decide who has access to read and write to each document individually. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  false)
    ->param('read', [] , new Wildcard() , 'An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->param('write', [] , new Wildcard() , 'An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->param('enabled', true , new Wildcard() , 'Is collection enabled?',  true)
    ->action(function ( $collectionId, $name, $permission, $read, $write, $enabled ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $name */
        /** @var string $permission */
        /** @var array $read */
        /** @var array $write */
        /** @var boolean $enabled */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}');
        $params = [];
        /** Body Params */
        $params['name'] = $name;
        $params['permission'] = $permission;
        $params['read'] = !is_array($read) ? array($read) : $read;
        $params['write'] = !is_array($write) ? array($write) : $write;
        $params['enabled'] = $enabled;
        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteCollection')
    ->label('description', "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID.',  false)
    ->action(function ( $collectionId ) use ($parser) {
        /** @var string $collectionId */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}');
        $params = [];
        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listAttributes')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->action(function ( $collectionId ) use ($parser) {
        /** @var string $collectionId */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createBooleanAttribute')
    ->label('description', "Create a boolean attribute.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', null , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var boolean $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/boolean');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createEmailAttribute')
    ->label('description', "Create an email attribute.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/email');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createEnumAttribute')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('elements', '' , new Wildcard() , 'Array of elements in enumerated type. Uses length of longest element to determine size.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $elements, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var array $elements */
        /** @var boolean $required */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/enum');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['elements'] = !is_array($elements) ? array($elements) : $elements;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createFloatAttribute')
    ->label('description', "Create a float attribute. Optionally, minimum and maximum values can be provided.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('min', '' , new Wildcard() , 'Minimum value to enforce on new documents',  true)
    ->param('max', '' , new Wildcard() , 'Maximum value to enforce on new documents',  true)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $min, $max, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var string $min */
        /** @var string $max */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/float');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['min'] = $min;
        $params['max'] = $max;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createIntegerAttribute')
    ->label('description', "Create an integer attribute. Optionally, minimum and maximum values can be provided.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('min', null , new Wildcard() , 'Minimum value to enforce on new documents',  true)
    ->param('max', null , new Wildcard() , 'Maximum value to enforce on new documents',  true)
    ->param('xdefault', null , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $min, $max, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var integer $min */
        /** @var integer $max */
        /** @var integer $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/integer');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['min'] = (int)$min;
        $params['max'] = (int)$max;
        $params['default'] = (int)$xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createIpAttribute')
    ->label('description', "Create IP address attribute.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/ip');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createStringAttribute')
    ->label('description', "Create a string attribute.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('size', '' , new Wildcard() , 'Attribute size for text attributes, in number of characters.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $size, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var integer $size */
        /** @var boolean $required */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/string');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['size'] = (int)$size;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createUrlAttribute')
    ->label('description', "Create a URL attribute.
\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->param('required', '' , new Wildcard() , 'Is attribute required?',  false)
    ->param('xdefault', '' , new Wildcard() , 'Default value for attribute when not provided. Cannot be set when attribute is required.',  true)
    ->param('xarray', false , new Wildcard() , 'Is attribute an array?',  true)
    ->action(function ( $collectionId, $key, $required, $xdefault, $xarray ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var boolean $required */
        /** @var string $xdefault */
        /** @var boolean $xarray */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/attributes/url');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['required'] = $required;
        $params['default'] = $xdefault;
        $params['array'] = $xarray;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getAttribute')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->action(function ( $collectionId, $key ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{key}'], [$collectionId, $key], '/database/collections/{collectionId}/attributes/{key}');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteAttribute')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Attribute Key.',  false)
    ->action(function ( $collectionId, $key ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{key}'], [$collectionId, $key], '/database/collections/{collectionId}/attributes/{key}');
        $params = [];
        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listDocuments')
    ->label('description', "Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's documents. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('queries', [] , new Wildcard() , 'Array of query strings.',  true)
    ->param('limit', 25 , new Wildcard() , 'Maximum number of documents to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Wildcard() , 'Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursor', '' , new Wildcard() , 'ID of the document used as the starting point for the query, excluding the document itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)',  true)
    ->param('cursorDirection', 'after' , new Wildcard() , 'Direction of the cursor.',  true)
    ->param('orderAttributes', [] , new Wildcard() , 'Array of attributes used to sort results.',  true)
    ->param('orderTypes', [] , new Wildcard() , 'Array of order directions for sorting attribtues. Possible values are DESC for descending order, or ASC for ascending order.',  true)
    ->action(function ( $collectionId, $queries, $limit, $offset, $cursor, $cursorDirection, $orderAttributes, $orderTypes ) use ($parser) {
        /** @var string $collectionId */
        /** @var array $queries */
        /** @var integer $limit */
        /** @var integer $offset */
        /** @var string $cursor */
        /** @var string $cursorDirection */
        /** @var array $orderAttributes */
        /** @var array $orderTypes */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/documents');
        $params = [];
        /** Query Params */
        $params['queries'] = !is_array($queries) ? array($queries) : $queries;
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['cursor'] = $cursor;
        $params['cursorDirection'] = $cursorDirection;
        $params['orderAttributes'] = !is_array($orderAttributes) ? array($orderAttributes) : $orderAttributes;
        $params['orderTypes'] = !is_array($orderTypes) ? array($orderTypes) : $orderTypes;
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createDocument')
    ->label('description', "Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/database#databaseCreateCollection) API or directly from your database console.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection with validation rules using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Wildcard() , 'Document ID. Choose your own unique ID or pass the string `unique()` to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.',  false)
    ->param('data', '' , new Wildcard() , 'Document data as JSON object.',  false)
    ->param('read', [] , new Wildcard() , 'An array of strings with read permissions. By default only the current user is granted with read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->param('write', [] , new Wildcard() , 'An array of strings with write permissions. By default only the current user is granted with write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->action(function ( $collectionId, $documentId, $data, $read, $write ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $documentId */
        /** @var object $data */
        /** @var array $read */
        /** @var array $write */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/documents');
        $params = [];
        /** Body Params */
        $params['documentId'] = $documentId;
        $params['data'] = \json_decode($data);
        $params['read'] = !is_array($read) ? array($read) : $read;
        $params['write'] = !is_array($write) ? array($write) : $write;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getDocument')
    ->label('description', "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Wildcard() , 'Document ID.',  false)
    ->action(function ( $collectionId, $documentId ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $documentId */

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
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection with validation rules using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Wildcard() , 'Document ID.',  false)
    ->param('data', '' , new Wildcard() , 'Document data as JSON object.',  false)
    ->param('read', [] , new Wildcard() , 'An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->param('write', [] , new Wildcard() , 'An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.',  true)
    ->action(function ( $collectionId, $documentId, $data, $read, $write ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $documentId */
        /** @var object $data */
        /** @var array $read */
        /** @var array $write */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{documentId}'], [$collectionId, $documentId], '/database/collections/{collectionId}/documents/{documentId}');
        $params = [];
        /** Body Params */
        $params['data'] = \json_decode($data);
        $params['read'] = !is_array($read) ? array($read) : $read;
        $params['write'] = !is_array($write) ? array($write) : $write;
        $response =  $client->call(Client::METHOD_PATCH, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteDocument')
    ->label('description', "Delete a document by its unique ID. This endpoint deletes only the parent documents, its attributes and relations to other documents. Child documents **will not** be deleted.\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('documentId', '' , new Wildcard() , 'Document ID.',  false)
    ->action(function ( $collectionId, $documentId ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $documentId */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{documentId}'], [$collectionId, $documentId], '/database/collections/{collectionId}/documents/{documentId}');
        $params = [];
        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('listIndexes')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->action(function ( $collectionId ) use ($parser) {
        /** @var string $collectionId */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/indexes');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('createIndex')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Index Key.',  false)
    ->param('type', '' , new Wildcard() , 'Index type.',  false)
    ->param('attributes', '' , new Wildcard() , 'Array of attributes to index.',  false)
    ->param('orders', [] , new Wildcard() , 'Array of index orders.',  true)
    ->action(function ( $collectionId, $key, $type, $attributes, $orders ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */
        /** @var string $type */
        /** @var array $attributes */
        /** @var array $orders */

        $client = new Client();
        $path   = str_replace(['{collectionId}'], [$collectionId], '/database/collections/{collectionId}/indexes');
        $params = [];
        /** Body Params */
        $params['key'] = $key;
        $params['type'] = $type;
        $params['attributes'] = !is_array($attributes) ? array($attributes) : $attributes;
        $params['orders'] = !is_array($orders) ? array($orders) : $orders;
        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getIndex')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Index Key.',  false)
    ->action(function ( $collectionId, $key ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{key}'], [$collectionId, $key], '/database/collections/{collectionId}/indexes/{key}');
        $params = [];
        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteIndex')
    ->label('description', "\n\n")
    ->param('collectionId', '' , new Wildcard() , 'Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).',  false)
    ->param('key', '' , new Wildcard() , 'Index Key.',  false)
    ->action(function ( $collectionId, $key ) use ($parser) {
        /** @var string $collectionId */
        /** @var string $key */

        $client = new Client();
        $path   = str_replace(['{collectionId}', '{key}'], [$collectionId, $key], '/database/collections/{collectionId}/indexes/{key}');
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
        Console::log("\nUsage : appwrite database [COMMAND]\n");
        Console::log("Commands :");
        $commands = [
                "listCollections" => "Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's collections. [Learn more about different API modes](/docs/admin).",
                "createCollection" => "Create a new Collection.",
                "getCollection" => "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.",
                "updateCollection" => "Update a collection by its unique ID.",
                "deleteCollection" => "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.",
                "listAttributes" => "",
                "createBooleanAttribute" => "Create a boolean attribute.
",
                "createEmailAttribute" => "Create an email attribute.
",
                "createEnumAttribute" => "",
                "createFloatAttribute" => "Create a float attribute. Optionally, minimum and maximum values can be provided.
",
                "createIntegerAttribute" => "Create an integer attribute. Optionally, minimum and maximum values can be provided.
",
                "createIpAttribute" => "Create IP address attribute.
",
                "createStringAttribute" => "Create a string attribute.
",
                "createUrlAttribute" => "Create a URL attribute.
",
                "getAttribute" => "",
                "deleteAttribute" => "",
                "listDocuments" => "Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's documents. [Learn more about different API modes](/docs/admin).",
                "createDocument" => "Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/database#databaseCreateCollection) API or directly from your database console.",
                "getDocument" => "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.",
                "updateDocument" => "Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.",
                "deleteDocument" => "Delete a document by its unique ID. This endpoint deletes only the parent documents, its attributes and relations to other documents. Child documents **will not** be deleted.",
                "listIndexes" => "",
                "createIndex" => "",
                "getIndex" => "",
                "deleteIndex" => "",
        ];
        $parser->formatArray($commands);
        Console::log("\nRun 'appwrite database COMMAND --help' for more information on a command.");
    });


$cli->run();
