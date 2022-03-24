// eslint-disable-next-line no-unused-vars
const assert = require('assert');
const puppeteer = require('puppeteer');
const { shouldTestBotBase } = require('./botbase.shared');
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const fs = require('fs');
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

    it('should take a screenshot with puppeteer', async () => {
        const mainUrl = 'https://google.com';
        const botbase = new BotBase({
            mainUrl,
            basePath,
            cookieSaver,
            screenshotSaver,
        });
        let screenshotPath;
        await botbase.initialize();
        await botbase.page.goto(mainUrl, { waitUntil: 'networkidle2' });
        try {
            screenshotPath = await botbase.takeScreenshot('tests');
            assert.equal(typeof screenshotPath, "string")
        } catch (err) {
            console.error(err);
            assert.fail('screenshot not successful');
        }

        try {
            fs.statSync(screenshotPath);
        } catch (err) {
            if (err.code == 'ENOENT') {
                assert.fail(`The file "${screenshotPath}" does not exist`);
            } else {
                throw err;
            }
        }

    });

});