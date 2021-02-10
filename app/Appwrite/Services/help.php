<?php

namespace Appwrite\Services;

echo "\e[0;31;m
   _                            _ _       
  /_\  _ __  _ ____      ___ __(_) |_ ___ 
 //_\\| '_ \| '_ \ \ /\ / / '__| | __/ _ \
/  _  \ |_) | |_) \ V  V /| |  | | ||  __/
\_/ \_/ .__/| .__/ \_/\_/ |_|  |_|\__\___|
      |_|   |_|                           
      
      \e[0m" ;

printf("\nUsage : appwrite [SERVICE] [COMMAND] --[OPTION]\n\n");
printf("Services :\n");
$mask = "\t%-20.20s %-125.125s\n";
printf($mask, "avatars", "");
printf($mask, "database", "");
printf($mask, "functions", "");
printf($mask, "health", "");
printf($mask, "locale", "");
printf($mask, "storage", "");
printf($mask, "teams", "");
printf($mask, "users", "");
printf("\nRun 'appwrite [SERVICE] help' for more information on a service.\n");
