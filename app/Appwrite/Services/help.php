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
printf($mask, "avatars", "The Avatars service aims to help you complete everyday tasks related to your app image, icons, and avatars.");
printf($mask, "database", "The Database service allows you to create structured collections of documents, query and filter lists of documents");
printf($mask, "functions", "The Functions Service allows you view, create and manage your Cloud Functions.");
printf($mask, "health", "The Health service allows you to both validate and monitor your Appwrite server&#039;s health.");
printf($mask, "locale", "The Locale service allows you to customize your app based on your users&#039; location.");
printf($mask, "storage", "The Storage service allows you to manage your project files.");
printf($mask, "teams", "The Teams service allows you to group users of your project and to enable them to share read and write access to your project resources");
printf($mask, "users", "The Users service allows you to manage your project users.");
printf("\nRun 'appwrite [SERVICE] help' for more information on a service.\n");
