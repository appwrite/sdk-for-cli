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

            Console::log("\e[0;31;m  \e[0m") ;
            Console::log("\nUsage : executable teams {$taskName} --[OPTIONS] \n");
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
    ->label('description', "Get a list of all the current user teams. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's teams. [Learn more about different API modes](/docs/admin).\n\n")
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/teams');
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
    ->label('description', "Create a new team. The user who creates the team will automatically be assigned as the owner of the team. The team owner can invite new members, who will be able add new owners and update or delete the team from your project.\n\n")
    ->param('name', '' , new Mock(), 'Team name. Max length: 128 chars.',  false)
    ->param('roles', ["owner"] , new Mock(), 'Array of strings. Use this param to set the roles in the team for the user who created it. The default role is **owner**. A role can be any string. Learn more about [roles and permissions](/docs/permissions). Max length for each role is 32 chars.',  true)
    ->action(function ( $name, $roles ) use ($parser) {
        $client = new Client();
        $path   = str_replace([], [], '/teams');
        $params = [];
        $params['name'] = $name;
        $params['roles'] = $roles;

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('get')
    ->label('description', "Get a team by its unique ID. All team members have read access for this resource.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->action(function ( $teamId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}'], [$teamId], '/teams/{teamId}');
        $params = [];

        $response =  $client->call(Client::METHOD_GET, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('update')
    ->label('description', "Update a team by its unique ID. Only team owners have write access for this resource.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->param('name', '' , new Mock(), 'Team name. Max length: 128 chars.',  false)
    ->action(function ( $teamId, $name ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}'], [$teamId], '/teams/{teamId}');
        $params = [];
        $params['name'] = $name;

        $response =  $client->call(Client::METHOD_PUT, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('delete')
    ->label('description', "Delete a team by its unique ID. Only team owners have write access for this resource.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->action(function ( $teamId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}'], [$teamId], '/teams/{teamId}');
        $params = [];

        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('getMemberships')
    ->label('description', "Get a team members by the team unique ID. All team members have read access for this list of resources.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->param('search', '' , new Mock(), 'Search term to filter your list results. Max length: 256 chars.',  true)
    ->param('limit', 25 , new Mock(), 'Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.',  true)
    ->param('offset', 0 , new Mock(), 'Results offset. The default value is 0. Use this param to manage pagination.',  true)
    ->param('orderType', 'ASC' , new Mock(), 'Order result by ASC or DESC order.',  true)
    ->action(function ( $teamId, $search, $limit, $offset, $orderType ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}'], [$teamId], '/teams/{teamId}/memberships');
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
    ->task('createMembership')
    ->label('description', "Use this endpoint to invite a new member to join your team. An email with a link to join the team will be sent to the new member email address if the member doesn't exist in the project it will be created automatically.

Use the 'URL' parameter to redirect the user from the invitation email back to your app. When the user is redirected, use the [Update Team Membership Status](/docs/client/teams#teamsUpdateMembershipStatus) endpoint to allow the user to accept the invitation to the team.

Please note that in order to avoid a [Redirect Attacks](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URL's are the once from domains you have set when added your platforms in the console interface.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->param('email', '' , new Mock(), 'New team member email.',  false)
    ->param('roles', '' , new Mock(), 'Array of strings. Use this param to set the user roles in the team. A role can be any string. Learn more about [roles and permissions](/docs/permissions). Max length for each role is 32 chars.',  false)
    ->param('url', '' , new Mock(), 'URL to redirect the user back to your app from the invitation email.  Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.',  false)
    ->param('name', '' , new Mock(), 'New team member name. Max length: 128 chars.',  true)
    ->action(function ( $teamId, $email, $roles, $url, $name ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}'], [$teamId], '/teams/{teamId}/memberships');
        $params = [];
        $params['email'] = $email;
        $params['name'] = $name;
        $params['roles'] = $roles;
        $params['url'] = $url;

        $response =  $client->call(Client::METHOD_POST, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });

$cli
    ->task('deleteMembership')
    ->label('description', "This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.\n\n")
    ->param('teamId', '' , new Mock(), 'Team unique ID.',  false)
    ->param('inviteId', '' , new Mock(), 'Invite unique ID.',  false)
    ->action(function ( $teamId, $inviteId ) use ($parser) {
        $client = new Client();
        $path   = str_replace(['{teamId}', '{inviteId}'], [$teamId, $inviteId], '/teams/{teamId}/memberships/{inviteId}');
        $params = [];

        $response =  $client->call(Client::METHOD_DELETE, $path, [
            'content-type' => 'application/json',
        ], $params);
        $parser->parseResponse($response);
    });


$cli
    ->task('help')
    ->action(function() use ($parser) {
        Console::log("\e[0;31;m  \e[0m");
        Console::log("\nUsage : executable teams [COMMAND]\n");
        Console::log("Commands :");
        $commands = [
                "list" => "Get a list of all the current user teams. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's teams. [Learn more about different API modes](/docs/admin).",
                "create" => "Create a new team. The user who creates the team will automatically be assigned as the owner of the team. The team owner can invite new members, who will be able add new owners and update or delete the team from your project.",
                "get" => "Get a team by its unique ID. All team members have read access for this resource.",
                "update" => "Update a team by its unique ID. Only team owners have write access for this resource.",
                "delete" => "Delete a team by its unique ID. Only team owners have write access for this resource.",
                "getMemberships" => "Get a team members by the team unique ID. All team members have read access for this list of resources.",
                "createMembership" => "Use this endpoint to invite a new member to join your team. An email with a link to join the team will be sent to the new member email address if the member doesn't exist in the project it will be created automatically.

Use the 'URL' parameter to redirect the user from the invitation email back to your app. When the user is redirected, use the [Update Team Membership Status](/docs/client/teams#teamsUpdateMembershipStatus) endpoint to allow the user to accept the invitation to the team.

Please note that in order to avoid a [Redirect Attacks](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URL's are the once from domains you have set when added your platforms in the console interface.",
                "deleteMembership" => "This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.",
        ];
        $parser->formatArray($commands);
        Console::log("\nRun 'executable teams COMMAND --help' for more information on a command.");
    });


$cli->run();
