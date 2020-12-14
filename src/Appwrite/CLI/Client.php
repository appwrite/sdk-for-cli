<?php

namespace Appwrite\CLI;

use Exception;
use Utopia\CLI\Console;

class Client
{
    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_PUT = 'PUT';
    const METHOD_PATCH = 'PATCH';
    const METHOD_DELETE = 'DELETE';
    const METHOD_HEAD = 'HEAD';
    const METHOD_OPTIONS = 'OPTIONS';
    const METHOD_CONNECT = 'CONNECT';
    const METHOD_TRACE = 'TRACE';

    const USER_PREFERENCES_FILE = __DIR__."/.prefs.json";
    const PREFERENCE_ENDPOINT = "endpoint";
    const PREFERENCE_APPWRITE_PROJECT = "X-Appwrite-Project";
    const PREFERENCE_APPWRITE_KEY = "X-Appwrite-Key";
    const PREFERENCE_APPWRITE_LOCALE = "X-Appwrite-Locale";

    /**
     * Default User Preferences
     *
     * @var array
     */
    private $preferences = [
        self::PREFERENCE_ENDPOINT => '',
        self::PREFERENCE_APPWRITE_PROJECT => '',
        self::PREFERENCE_APPWRITE_KEY => '',
        self::PREFERENCE_APPWRITE_LOCALE => ''
    ];

    /**
     * Is Self Signed Certificates Allowed?
     *
     * @var bool
     */
    private $selfSigned = false;

    /**
     * Global Headers
     *
     * @var array
     */
    private $headers = [
        'content-type' => '',
        'x-sdk-version' => 'appwrite:php:1.1.0',
    ];

    /**
     * SDK constructor.
     */
    public function __construct()
    {
        /* Load user defaults from a json file if available
           Else Propmt the user to enter the details
        */
        if (!$this->loadPreferences()) {
            $this->promptUser();
        }

        $this->setProject($this->preferences[self::PREFERENCE_APPWRITE_PROJECT])
            ->setKey($this->preferences[self::PREFERENCE_APPWRITE_KEY])
            ->setLocale($this->preferences[self::PREFERENCE_APPWRITE_LOCALE]);
    }

    public function getPreference(string $key): string
    {
        return $this->preferences[$key];
    }

    public function setPreference(string $key , string $value) 
    {
        $this->preferences[$key] = $value;
    }

    private function promptUser()
    {
        if(empty($this->getPreference(self::PREFERENCE_ENDPOINT))) {
            $endpoint = Console::confirm('Choose your API Endpoint: ( default: http://localhost/v1 )');
            $this->setPreference(self::PREFERENCE_ENDPOINT, ($endpoint) ? $endpoint : 'http://localhost/v1');
        }

        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_PROJECT))) {
            $project = Console::confirm('Enter your project ID from the Appwrite console: ');
            if (empty($project)) {
                Console::error("You cannot continue without a project ID. Exiting...");
                exit();
            } 
            $this->setPreference(self::PREFERENCE_APPWRITE_PROJECT, $project);
        }
        
        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_KEY))) {
            $key = Console::confirm('Enter your project key from the Appwrite console: ');
            if (empty($key)) {
                Console::error("You cannot continue without a project key. Exiting...");
                exit();
            } 
            $this->setPreference(self::PREFERENCE_APPWRITE_KEY, $key);
        }
        
        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_LOCALE))) {
            $locale = Console::confirm('Enter your locale : ( default : en-IN )');
            $this->setPreference(self::PREFERENCE_APPWRITE_LOCALE, $locale ? $locale : "en-IN" );
        }
        
        $this->savePreferences();
    }

    /**
     * Function to load user preferences from
     * the JSON file
     */
    private function loadPreferences(string $filename = self::USER_PREFERENCES_FILE): bool
    {
        try {
            $jsondata = @file_get_contents($filename);
            if($jsondata === FALSE) {
                return false;
            }

            $arr_data = json_decode($jsondata, true);
            $this->preferences = array_replace($this->preferences, $arr_data);
            if (!$this->isPreferenceLoaded()) {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    private function isPreferenceLoaded() : bool {
        if(empty($this->getPreference(self::PREFERENCE_ENDPOINT))) return false;
        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_PROJECT))) return false;
        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_KEY))) return false;
        if(empty($this->getPreference(self::PREFERENCE_APPWRITE_LOCALE))) return false;
        return true;
    }

    /**
     * Function to write user preferences to
     * the JSON file
     */
    private function savePreferences(string $filename = self::USER_PREFERENCES_FILE)
    {
        $jsondata = json_encode($this->preferences, JSON_PRETTY_PRINT);
        if (file_put_contents($filename, $jsondata)) {
            echo 'Data successfully saved';
        } else {
            echo "error";
        }
    }

    /**
     * Set Project
     *
     * Your project ID
     *
     * @param string $value
     *
     * @return Client
     */
    public function setProject($value)
    {
        $this->addHeader(self::PREFERENCE_APPWRITE_PROJECT, $value);

        return $this;
    }

    /**
     * Set Key
     *
     * Your secret API key
     *
     * @param string $value
     *
     * @return Client
     */
    public function setKey($value)
    {
        $this->addHeader(self::PREFERENCE_APPWRITE_KEY, $value);

        return $this;
    }

    /**
     * Set Locale
     *
     * @param string $value
     *
     * @return Client
     */
    public function setLocale($value)
    {
        $this->addHeader(self::PREFERENCE_APPWRITE_LOCALE, $value);

        return $this;
    }


    /***
     * @param bool $status
     * @return $this
     */
    public function setSelfSigned($status = true)
    {
        $this->selfSigned = $status;

        return $this;
    }

    /***
     * @param $endpoint
     * @return $this
     */
    public function setEndpoint($endpoint)
    {
        $this->setPreference(self::PREFERENCE_ENDPOINT. $endpoint);
        return $this;
    }

    /**
     * @param $key
     * @param $value
     */
    public function addHeader($key, $value)
    {
        $this->headers[strtolower($key)] = strtolower($value);
        
        return $this;
    }

    /**
     * Call
     *
     * Make an API call
     *
     * @param string $method
     * @param string $path
     * @param array $params
     * @param array $headers
     * @return array|string
     * @throws Exception
     */
    public function call($method, $path = '', $headers = array(), array $params = array())
    {
        $headers            = array_merge($this->headers, $headers);
        $ch                 = curl_init($this->getPreference(self::PREFERENCE_ENDPOINT) . $path . (($method == self::METHOD_GET && !empty($params)) ? '?' . http_build_query($params) : ''));
        $responseHeaders    = [];
        $responseStatus     = -1;
        $responseType       = '';
        $responseBody       = '';

        switch ($headers['content-type']) {
            case 'application/json':
                $query = json_encode($params);
                break;

            case 'multipart/form-data':
                $query = $this->flatten($params);
                break;

            default:
                $query = http_build_query($params);
                break;
        }

        foreach ($headers as $i => $header) {
            $headers[] = $i . ':' . $header;
            unset($headers[$i]);
        }

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, php_uname('s') . '-' . php_uname('r') . ':php-' . phpversion());
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$responseHeaders) {
            $len = strlen($header);
            $header = explode(':', strtolower($header), 2);

            if (count($header) < 2) { // ignore invalid headers
                return $len;
            }

            $responseHeaders[strtolower(trim($header[0]))] = trim($header[1]);

            return $len;
        });

        if ($method != self::METHOD_GET) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        }

        // Allow self signed certificates
        if ($this->selfSigned) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        }

        $responseBody   = curl_exec($ch);
        $responseType   = (isset($responseHeaders['content-type'])) ? $responseHeaders['content-type'] : '';
        $responseStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        switch (substr($responseType, 0, strpos($responseType, ';'))) {
            case 'application/json':
                $responseBody = json_decode($responseBody, true);
            break;
        }

        if ((curl_errno($ch)/* || 200 != $responseStatus*/)) {
            throw new Exception(curl_error($ch) . ' with status code ' . $responseStatus, $responseStatus);
        }

        curl_close($ch);

        return $responseBody;
    }

    /**
     * Flatten params array to PHP multiple format
     *
     * @param array $data
     * @param string $prefix
     * @return array
     */
    private function flatten(array $data, $prefix = '')
    {
        $output = [];

        foreach ($data as $key => $value) {
            $finalKey = $prefix ? "{$prefix}[{$key}]" : $key;

            if (is_array($value)) {
                $output += $this->flatten($value, $finalKey); // @todo: handle name collision here if needed
            } else {
                $output[$finalKey] = $value;
            }
        }

        return $output;
    }
}
