// eslint-disable-next-line no-unused-vars
const assert = require('assert');
const chromium = require('chrome-aws-lambda');
const { shouldTestBotBase } = require('./botbase.shared');
const puppeteer = chromium.puppeteer;
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const basePath = path.resolve(__dirname, '../');

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    const result = dotenv.config({
        path: '.env.test'
    });
    if (result.error) {
        throw result.error;
    }
}
const { S3_BUCKET_NAME, botName } = process.env;

const S3CookieSaver = require('../S3CookieSaver');
const cookieSaver = new S3CookieSaver({
    S3_BUCKET_NAME,
    output_filename: botName
});

const S3ScreenshotSaver = require('../S3ScreenshotSaver');

const screenshotSaver = new S3ScreenshotSaver({
    S3_BUCKET_NAME,
    botName,
});

const S3Manager = require("../S3Manager");
const s3Manager = new S3Manager(S3_BUCKET_NAME);

describe('Botbase AWS Tests', () => {

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
            const exists = await s3Manager.objectExists(screenshotPath);
            assert.strictEqual(exists, true);
        } catch (err) {
            if (err.code == 'ENOENT') {
                assert.fail(`The file "${screenshotPath}" does not exist on bucket`);
            } else {
                throw err;
            }
        }
    });

});