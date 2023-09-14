# Appwrite Command Line SDK

![License](https://img.shields.io/github/license/appwrite/sdk-for-cli.svg?style=flat-square)
![Version](https://img.shields.io/badge/api%20version-1.4.2-blue.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/appwrite/sdk-generator?style=flat-square)](https://travis-ci.com/appwrite/sdk-generator)
[![Twitter Account](https://img.shields.io/twitter/follow/appwrite?color=00acee&label=twitter&style=flat-square)](https://twitter.com/appwrite)
[![Discord](https://img.shields.io/discord/564160730845151244?label=discord&style=flat-square)](https://appwrite.io/discord)

**This SDK is compatible with Appwrite server version 1.4.x. For older versions, please check [previous releases](https://github.com/appwrite/sdk-for-cli/releases).**

Appwrite is an open-source backend as a service server that abstract and simplify complex and repetitive development tasks behind a very simple to use REST API. Appwrite aims to help you develop your apps faster and in a more secure way. Use the Command Line SDK to integrate your app with the Appwrite server to easily start interacting with all of Appwrite backend APIs and tools. For full API documentation and tutorials go to [https://appwrite.io/docs](https://appwrite.io/docs)

![Appwrite](https://appwrite.io/images/github.png)

## Installation

The Appwrite CLI is a Node based command line tool to help you interact with the Appwrite API. The CLI is distributed both as an [`npm package`](https://www.npmjs.com/package/appwrite-cli) as well as [pre built binaries](https://github.com/appwrite/sdk-for-cli/releases/latest) for specific operating systems and architectures.

### Install using NPM
---

If you have `npm` installed, it's as easy as running

```sh
$ npm install -g appwrite-cli
```

Once the installation is complete, you can verify the install using

```sh
$ appwrite -v
4.1.0
```

### Install using prebuilt binaries
---

If you do not have `npm` installed, you can always install the prebuilt binaries for your architecture and OS using our convenient installation scripts.

### Linux / MacOS Terminal
```bash
$ wget -q https://appwrite.io/cli/install.sh  -O - | /bin/bash
```

### MacOS via [Homebrew](https://brew.sh)
```bash
$ brew tap appwrite/sdk-for-cli https://github.com/appwrite/sdk-for-cli
$ brew update
$ brew install --HEAD appwrite 
```
> Please note that `--HEAD` will be removed with official release.

### Windows
Via Powershell
```powershell
$ iwr -useb https://appwrite.io/cli/install.ps1 | iex
```
Via [Scoop](https://scoop.sh)
```powershell
$ scoop install https://raw.githubusercontent.com/appwrite/sdk-for-cli/master/scoop/appwrite.json
```

Once the installation completes, you can verify your install using
```
$ appwrite -v
4.1.0
```

## Getting Started 

Before you can use the CLI, you need to login to your Appwrite account. 

```sh
$ appwrite login

? Enter your email test@test.com
? Enter your password ********
✓ Success 
```
This will also prompt you to enter your Appwrite endpoint ( default: http://localhost/v1 ) 

* ### Initialising your project
Once logged in, the CLI needs to be initialised before you can use it with your Appwrite project. You can do this with the `appwrite init project` command. 

```sh
$ appwrite init project
```

The following prompt will guide you through the setup process. The `init` command also creates an `appwrite.json` file representing your Appwrite project.

The `appwrite.json` file does a lot of things. 
* Provides context to the CLI
* Keeps track of all your cloud functions
* Keeps track of all your project's collections
* Helps you deploy your Appwrite project to production and more..

You can also fetch all the collections in your current project using
```sh
appwrite init collection
```

* ### Creating and deploying cloud functions

The CLI makes it extremely easy to create and deploy Appwrite's cloud functions. Initialise your new function using

```
$ appwrite init function
? What would you like to name your function? My Awesome Function
? What runtime would you like to use? Node.js (node-15.5)
✓ Success 
```

This will create a new function `My Awesome Function` in your current Appwrite project and also create a template function for you to get started.

```sh
$ tree My\ Awesome\ Function 

My Awesome Function
├── README.md
├── index.js
├── package-lock.json
└── package.json

0 directories, 4 files
```

You can now deploy this function using 

```sh
$ appwrite deploy function

? Which functions would you like to deploy? My Awesome Function (61d1a4c81dfcd95bc834)
ℹ Info Deploying function My Awesome Function ( 61d1a4c81dfcd95bc834 )
✓ Success Deployed My Awesome Function ( 61d1a4c81dfcd95bc834 )
```

Your function has now been deployed on your Appwrite server! As soon as the build process is finished, you can start executing the function.

* ### Deploying Collections

Similarly, you can deploy all your collections to your Appwrite server using 

```sh
appwrite deploy collections
```

> ### Note
> By default, requests to domains with self signed SSL certificates (or no certificates) are disabled. If you trust the domain, you can bypass the certificate validation using
```sh
$ appwrite client --selfSigned true
```

## Usage 

The Appwrite CLI follows the following general syntax.
```sh
$ appwrite [COMMAND] --[OPTIONS]
```

A few sample commands to get you started 

```sh
$ appwrite users create --userId "unique()" --email hello@appwrite.io --password very_strong_password
$ appwrite users list 
```

To create a document you can use the following command 
```sh
$ appwrite database createDocument --collectionId <ID> --documentId 'unique()' --data '{ "Name": "Iron Man" }' --permissions 'read("any")' 'read("team:abc")'
```

### Some Gotchas
- `data` must be a valid JSON string where each key and value are enclosed in double quotes `"` like the example above.
- Some arguments like the `read` and `write` permissions are expected to be arrays. In the Appwrite CLI, array values are passed in using space as a separator like in the example above.


To get information about the different services available, you can use 
```sh
$ appwrite -h
```

To get information about a particular service and the commands available in a service you can use 
```sh
$ appwrite users // or
$ appwrite users --help // or
$ appwrite users help // or
$ appwrite accounts
```

To get information about a particular command and the parameters it accepts, you can use

```sh
$ appwrite users list --help
$ appwrite account get --help 
```

At any point, you can view or reset the CLI configuration using the `client` service.

```
$ appwrite client --debug
// This will display your endpoint, projectID, API key and so on.
$ appwrite client --reset
```

## CI mode

The Appwrite CLI can also work in a CI environment. The initialisation of the CLI works a bit differently in CI. In CI, you set your `endpoint`, `projectId` and `API Key` using 

```sh
appwrite client --endpoint http://localhost/v1 --projectId <PROJECT_ID> --key <API KEY>
```

## Contribution

This library is auto-generated by Appwrite custom [SDK Generator](https://github.com/appwrite/sdk-generator). To learn more about how you can help us improve this SDK, please check the [contribution guide](https://github.com/appwrite/sdk-generator/blob/master/CONTRIBUTING.md) before sending a pull-request.

To build and test the CLI for development, follow these steps 

1. Clone the SDK Generator repository and cd into the directory
```sh
$ git clone https://github.com/appwrite/sdk-generator
$ cd sdk-generator
```

2. Ensure Docker is running locally and then install the composer dependencies using
```sh 
$ docker run --rm --interactive --tty --volume "$(pwd)":/app composer install --ignore-platform-reqs --optimize-autoloader --no-plugins --no-scripts --prefer-dist

# Generate the SDKs
$ docker run --rm -v $(pwd):/app -w /app php:8.1-cli php example.php
```

3. Head over to the generated SDK and install the dependencies.
```sh
$ cd examples/cli
$ npm install 
```

4. Install the CLI using 
```sh
$ npm install -g .
```

5. You can now use the CLI 
```sh
$ appwrite -v
```
## License

Please see the [BSD-3-Clause license](https://raw.githubusercontent.com/appwrite/appwrite/master/LICENSE) file for more information.
