# KeyCache-chrome

> Chrome Extension React.js project for KeyCache.

KeyCache is an open source password manager, using the latest best practices (I hope) in cryptographic security. 

## Features

 - Simple
 - Secure -- uses AES 256 encryption for all data, with a random key wrapped by a master passphrase. The master passphrase is never stored

## Status

alpha

## Installation

```bash
# clone it
$ git clone https://github.com/blnz/KeyCache-chrome.git

# Install dependencies
$ npm install
```

## Development

* Run script

```bash
# build files to './dev'
# start webpack development server
$ npm run dev
```

* If you're developing Inject page, please allow `https://localhost:3000` connections. (Because `injectpage` injected into HTTPS pages, so webpack server procotol must be https.) You can allow localhost connections by setting the chrome flag at: `chrome://flags/#allow-insecure-localhost`
* [Load unpacked extensions](https://developer.chrome.com/extensions/getstarted#unpacked) with `./dev` folder.

#### React/Redux hot reload

This extension uses `Webpack` and `react-transform`, and use `Redux`. You can hot reload by editing related files of Popup & Window & Inject page.

#### Using Redux DevTools Extension

You can use [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) on development mode.

## Build

```bash
# build files to './build'
$ npm run build
```

## Compress
```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

#### Options

If you want to build `crx` file (auto update), please provide options, and add `update.xml` file url in [manifest.json](https://developer.chrome.com/extensions/autoupdate#update_url manifest.json).

* --app-id: your extension id (can be get it when you first release extension)
* --key: your private key path (default: './key.pem')  
  you can use `npm run compress-keygen` to generate private key `./key.pem`
* --codebase: your `crx` file url

See [autoupdate guide](https://developer.chrome.com/extensions/autoupdate) for more information.


## LICENSE

[MIT](LICENSE)
