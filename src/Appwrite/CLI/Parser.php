<?php
namespace Appwrite\CLI;

use jc21\CliTable;
use jc21\CliTableManipulator;

class Manipulators extends CliTableManipulator {
    public function truncate($value) {
		return strlen($value) > 15 ? substr($value,0,15).'...' : $value;
    }    
}

class Parser {

    private const colors = array(
        'blue',
        'red',
        'green',
        'yellow',
        'magenta',
        'cyan',
        'white',
        'grey'
    );

    private const tableColor = self::colors[0];
    private const headerColor = self::colors[2];

    public function parseResponse($response, $properties = array()) {
        print_r($response);
    
        foreach ($response as $key => $value) {
            if (is_array($value)) {
                $this->drawTable($value, self::headerColor, self::tableColor);
            } 
            else {
                $this->drawKeyValue($key, $value);
            }
        }
    }

    private function drawKeyValue($key, $value){
        printf("%s : %s\n", $key, $value);
    }

    private function getColor($index = -1) : string {
        if ($index != -1) return self::colors[$index % count(self::colors) ];
        return self::colors[array_rand(self::colors)];
    }

    private function drawTable($data, $headerColor, $tableColor, $columnProps = []) {
        if (!is_array($data) || count($data) == 0 || !is_array($data[0])) return;

        $keys = array_keys($data[0]);
        
        $table = new CliTable();
        $table->setTableColor($tableColor);
        $table->setHeaderColor($headerColor);
        
        foreach ($keys as $key => $value) {
            $table->addField(ucwords($value), $value, new Manipulators('truncate'), $this->getColor($key));
        }
        
        $table->injectData($data);
        $table->display();
    }
}