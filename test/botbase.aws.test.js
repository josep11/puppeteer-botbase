// eslint-disable-next-line no-unused-vars
/* global it, describe  */
const chromium = require('chrome-aws-lambda');
const { shouldTestBotBase } = require('./botbase.shared');
const puppeteer = chromium.puppeteer;
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const basePath = path.resolve(__dirname, '../');

const LocalFsCookieSaver = require('../LocalFsCookieSaver');
const LocalScreenshotSaver = require('../LocalScreenshotSaver');
// TODO: should create and inject AWSCookieSaver or AWSScreenshotSaver
const cookieSaver = new LocalFsCookieSaver({ cookiesFilePath: path.resolve(basePath, './res/cookies.json') });
const screenshotSaver = new LocalScreenshotSaver({ screenshotBasepath: path.resolve(basePath, './screenshots') });

describe('Botbase AWS Tests', () => {

    shouldTestBotBase({
        puppeteer,
        BotBase,
        basePath,
        cookieSaver,
        screenshotSaver
    });

});