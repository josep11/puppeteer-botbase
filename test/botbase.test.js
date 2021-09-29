/* global it, describe, after  */
const assert = require('assert');
const BotBase = require('../botbase');
// var expect = require("chai").expect;
const path = require('path');

class ExampleChild extends BotBase {
    constructor(basePath) {
        super('http://dummy.com', basePath, {
            settings: {
                enabled: false
            }
        })
    }
}

describe('Botbase Tests', () => {
    let botbase = null;

    it('should intantiate BotBase', () => {
        botbase = new BotBase('http://sampleurl.com', path.resolve(__dirname, '../'));
        assert.ok(botbase);
    });

    it('should throw an error on constructor because of first param type style', () => {
        let mainUrl = 'http://google.com';
        assert.throws(() => {
            let botbase6 = new BotBase(path.resolve(__dirname, '../'), mainUrl);
        }, 'botbase constructor param order is wrong');
    })

    it('should throw on instantiation BotBase', () => {
        let mainUrl = {};

        assert.throws(() => {
            let botbase2 = new BotBase(path.resolve(__dirname, '../'), mainUrl);
        }, 'botbase constructor not checking mainUrl type parameter');

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