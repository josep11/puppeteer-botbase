const { fail } = require('assert');
const assert = require('assert');
const BotBase = require('../botbase');
// var expect = require("chai").expect;

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
    it('should get a sample website with puppeteer', async () => {

        await botbase._testSampleWebsite();

    });

});