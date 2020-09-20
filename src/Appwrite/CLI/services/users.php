<?php

namespace Appwrite\CLI\services;

require_once './vendor/autoload.php';

use Appwrite\CLI\Client;
use Utopia\CLI\CLI;
use Utopia\CLI\Console;
use Utopia\Validator\Mock;
use Exception;

$client = new Client();

// $cli = new CLI();

// $cli
//     ->task('list')
//     ->param('search', '', new Mock(), 'Search query', true)
//     ->param('limit', 25, new Mock(), 'Limit', true)
//     ->param('offset', 0, new Mock(), 'offset', true)
//     ->param('orderType', 'ASC', new Mock(), 'orderType', true)
//     ->action(function ($search, $limit, $offset, $orderType) {
//         global $client;

//         if(!empty($search)) {
//             $search = Console::confirm('Choose the user to search: (default: all)');
//             $search = ($search) ? $search : 'localhost';
//         }

//         if(!empty($limit)) {
//             $limit = Console::confirm('Choose your limit: (default: 25)');
//             $limit = ($limit) ? $limit : 25;
//         }

//         $path   = str_replace([], [], '/users');
//         $params = [];

//         $params['search'] = $search;
//         $params['limit'] = $limit;
//         $params['offset'] = $offset;
//         $params['orderType'] = $orderType;

//         $client->call(Client::METHOD_GET, $path, [
//             'content-type' => 'application/json',
//         ], $params);

//         Console::success("Success");
//     });

// $cli->run();
