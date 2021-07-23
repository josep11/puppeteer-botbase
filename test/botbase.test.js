const { fail } = require('assert');
const assert = require('assert');
const BotBase = require('../botbase');
// var expect = require("chai").expect;

class ExampleChild extends BotBase {
    constructor(basePath) {
        super(basePath, {
            settings: {
                enabled: false
            }
        })
    }
}

describe('Botbase Tests', () => {
    let botbase = null;

    it('should intantiate BotBase', () => {
        botbase = new BotBase();
        assert.ok(botbase);
    });
    it('should call successfully initialise', async () => {

        await botbase.initialize();

    });
    it('should log ip to text file', async () => {

        await botbase.logIP();

    });

    it('should get enabled true as default option', async () => {
        const enabled = botbase.enabled();
        assert.ok(enabled);
    });

    it('should get enabled false as default option for child class', async () => {
        const myChildCls = new ExampleChild(__dirname);
        const enabled = myChildCls.enabled();
        assert.strictEqual(enabled, false);
        const config = myChildCls.getConfig();
        const errMsg = 'it didnt override config properties rather delete the previous ones';
        assert.ok(config, errMsg);
        assert.ok(config.settings, errMsg);
        assert.ok(config.settings.width, errMsg);
    });

    it('should get a sample website with puppeteer', async () => {
        await botbase._testSampleWebsite();
    });

});