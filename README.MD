# BOT BASE

Utilities to reuse codebase for Scraping with Puppeteer

## Install

```bash
npm i git+https://github.com/josep11/puppeteer-botbase.git
```

To install a specific version run:

```bash
npm i git+https://github.com/josep11/puppeteer-botbase.git#0.1.3
```

## Config

On instantiation it accepts config as second param that will merge the default configuration, overwritting the parameter "config" over the default ones.

## Classes

To use and import the BotBase import like so:

```js
    const BotBase = require('botbase');
    class Milanuncios extends BotBase { ... }
```

To use the helper class import:

```js
const helper = require('botbase/helper');
```

To use the Puppeteer Helper class import like so (all methods are static - as of version 0.1.0):

```js
const HelperPuppeteer = require('botbase/helper_puppeteer');
```
