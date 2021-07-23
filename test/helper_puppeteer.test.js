const { fail } = require('assert');
const assert = require('assert');
const expect = require("chai").expect;

const helper_puppeteer = require('../helper_puppeteer');

describe('Module Helper Puppeteer Tests', () => {

    it('should get helper puppeteer', () => {
        assert.ok(helper_puppeteer);
    });

});