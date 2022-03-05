/* global it, describe  */
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const shouldTestBotBase = ({ BotBase, projectRoot }) => {

    class ExampleChild extends BotBase {
        constructor(basePath) {
            super(
                'http://dummy.com',
                basePath, {
                settings: {
                    enabled: false
                }
            })
        }
    }

    let botbase = null;

    it('should intantiate BotBase', () => {
        botbase = new BotBase('http://sampleurl.com', projectRoot);
        assert.ok(botbase);
    });

    it('should get enabled true as default option', async () => {
        // TODO: maybe no need to insantiate again
        botbase = new BotBase('http://sampleurl.com', projectRoot);

        const enabled = botbase.enabled();
        assert.ok(enabled);
    });

    it('should get enabled false as default option for child class', () => {
        const myChildCls = new ExampleChild(__dirname);
        const enabled = myChildCls.enabled();
        assert.strictEqual(false, enabled);
    });

    it('should override default config properties', () => {
        const myChildCls = new ExampleChild(__dirname);
        const config = myChildCls.getConfig();
        const errMsg = 'it didnt override config properties rather deconste the previous ones';
        assert.ok(config, errMsg);
        assert.ok(config.settings, errMsg);
        assert.ok(config.settings.width, errMsg);
    });


    it('should throw an error on constructor because of first param type style', () => {
        const mainUrl = 'http://google.com';
        assert.throws(() => {
            new BotBase(projectRoot, mainUrl);
        }, 'botbase constructor param order is wrong');
    })

    it('should throw on instantiation BotBase', () => {
        const mainUrl = {};

        assert.throws(() => {
            new BotBase(projectRoot, mainUrl);
        }, 'botbase constructor not checking mainUrl type parameter');

    });

    it('should call successfully initialise', async () => {

        await botbase.initialize();

    });

    it('should log ip to text file', async () => {

        await botbase.logIP();

    });


    it('should get a sample website with puppeteer', async () => {

        await botbase._testSampleWebsite();

    });

    it('should take a screenshot with puppeteer', async () => {

        let screenshotPath;
        await botbase.page.goto('https://google.com', { waitUntil: 'networkidle2' });
        try {
            screenshotPath = await botbase.takeScreenshot('tests');
            assert.equal(typeof screenshotPath, "string")
        } catch (err) {
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
        // TODO: clean up screenshot tests
    });
};

module.exports = {
    shouldTestBotBase
};

