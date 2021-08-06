const { fail } = require('assert');
const assert = require('assert');
const BotBase = require('../botbase');
// var expect = require("chai").expect;
const path = require('path');
const chromium = require('chrome-aws-lambda')


describe('Botbase with Chromium Tests', () => {
    let botbase = new BotBase('http://sampleurl.com', path.resolve(__dirname, '../'));

    it('should call successfully initialise with puppeteer', async () => {

        //NOT PASSED, maybe because it can only be run inside lambda linux env
        await botbase.initialize({ chromium });

    });
    it('should log ip to text file', async () => {

        await botbase.logIP();

    });

    it('should get a sample website with puppeteer', async () => {

        await botbase._testSampleWebsite(chromium.puppeteer);

    });

});