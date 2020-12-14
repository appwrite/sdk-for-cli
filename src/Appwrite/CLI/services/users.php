<?php

namespace Appwrite\CLI\services;

require_once './vendor/autoload.php';

use Appwrite\CLI\Client;
use Utopia\CLI\CLI;
use Utopia\CLI\Console;
use Utopia\Validator\Mock;
use Appwrite\CLI\Parser;
use Exception;

$client = new Client();
$parser = new Parser();


$cli = new CLI();

$cli
    ->task('list')
    ->param('search', '', new Mock(), 'Search query', true)
    ->param('limit', 25, new Mock(), 'Limit', true)
    ->param('offset', 0, new Mock(), 'offset', true)
    ->param('orderType', 'ASC', new Mock(), 'orderType', true)
    ->action(function ($search, $limit, $offset, $orderType) {
        global $client;
        global $parser;

        $path   = str_replace([], [], '/users');
        $params = [];

        $params['search'] = $search;
        $params['limit'] = $limit;
        $params['offset'] = $offset;
        $params['orderType'] = $orderType;

        $response = $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);
    });


$cli
    ->task('create')
    ->param('email', '', new Mock(), "User's email ID" ,true)
    ->param('password', '', new Mock(), "User's password", true)
    ->param('name', '', new Mock(), "User's Name", true)
    ->action(function($email, $password, $name) {
        global $client;
        global $parser;

        if (empty($email)) {
            Console::error("Cannot proceed without email. Exiting ...");
            exit();
        }

        if (empty($password)) {
            Console::error("Cannot proceed without password. Exiting ...");
            exit();
        }

        if (empty($name)) {
            Console::error("Cannot proceed without name. Exiting ...");
            exit();
        }

        $path   = str_replace([], [], '/users');
        $params = [];

        $params['email'] = $email;
        $params['password'] = $password;
        $params['name'] = $name;

        $response = $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);

        $parser->parseResponse($response);
    }); 

$cli->run();
