<?php

namespace Appwrite\Services;

require_once './vendor/autoload.php';

use Appwrite\Client;
use Utopia\CLI\CLI;
use Utopia\Validator\Mock;
use Utopia\CLI\Console;

$client = new Client();
$cli = new CLI();

$cli
    ->task('setEndpoint')
    ->param('endpoint', '', new Mock(), 'Your Appwrite endpoint', false)
    ->action(function($endpoint) use ($client) {
        $client->setPreference('endpoint', $endpoint);
        $result = $client->savePreferences();
        if ($result === false) {
            Console::error('Could not save preferences.');
        } else {
            Console::success('Preferences saved successfully');
        }
    });


$cli
    ->task('setProject')
    ->param('project', '', new Mock(), 'Your project ID', false)
    ->action(function($project) use ($client) {
        $client->setPreference('X-Appwrite-Project', $project);
        $result = $client->savePreferences();
        if ($result === false) {
            Console::error('Could not save preferences.');
        } else {
            Console::success('Preferences saved successfully');
        }
    });

$cli
    ->task('setKey')
    ->param('key', '', new Mock(), 'Your secret API key', false)
    ->action(function($key) use ($client) {
        $client->setPreference('X-Appwrite-Key', $key);
        $result = $client->savePreferences();
        if ($result === false) {
            Console::error('Could not save preferences.');
        } else {
            Console::success('Preferences saved successfully');
        }
    });

$cli
    ->task('setLocale')
    ->param('locale', '', new Mock(), '', false)
    ->action(function($locale) use ($client) {
        $client->setPreference('X-Appwrite-Locale', $locale);
        $result = $client->savePreferences();
        if ($result === false) {
            Console::error('Could not save preferences.');
        } else {
            Console::success('Preferences saved successfully');
        }
    });


$cli
    ->task('version')
    ->action(function() {
       Console::log('CLI Version : 0.2.0');
       Console::log('Server Version : 0.7.0');
    });

$cli->run();