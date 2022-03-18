// eslint-disable-next-line no-unused-vars
/* global it, describe  */
const puppeteer = require('puppeteer');
const { shouldTestBotBase } = require('./botbase.shared');
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const basePath = path.resolve(__dirname, '../');

const LocalFsCookieSaver = require('../LocalFsCookieSaver');
const LocalScreenshotSaver = require('../LocalScreenshotSaver');
const cookieSaver = new LocalFsCookieSaver({ cookiesFilePath: path.resolve(basePath, './res/cookies.json') });
const screenshotSaver = new LocalScreenshotSaver({ screenshotBasepath: path.resolve(basePath, './screenshots') });


describe('Botbase Tests', () => {

    shouldTestBotBase({
        puppeteer,
        BotBase,
        basePath,
        cookieSaver,
        screenshotSaver
    });

});