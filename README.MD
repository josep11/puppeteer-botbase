# BOT BASE

Utilities to reuse codebase for Scraping with Puppeteer

## Install

```bash
npm i git+https://github.com/josep11/puppeteer-botbase.git
```

To install a specific version or semver versions run:

It will pick it by the tag version. List of tags [here](2)

```bash
# this will install an exact version
npm i git+https://github.com/josep11/puppeteer-botbase.git#0.1.3
npm i github:josep11/puppeteer-botbase.git#semver:^1.0.10
```

```bash
# this will install from semver version
npm i github:josep11/puppeteer-botbase.git#semver:^2.0.0
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

## TODO

Should move all source files inside src directory and then create an index.js that exports all the files:

```js
module.exports = {
    BotBase,
    helper,
    ...
};
```

[1]: https://github.com/josep11/puppeteer-botbase.git
[2]: https://github.com/josep11/puppeteer-botbase/tags
