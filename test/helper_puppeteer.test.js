/* global it, describe, after  */
const assert = require('assert');
const expect = require("chai").expect;
// Require the Puppeteer module and the built-in assert module
const puppeteer = require('puppeteer')
let browser, page

// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
})

const HelperPuppeteer = require('../helper_puppeteer');

describe('Module Helper Puppeteer Tests', () => {

    it('should import helper puppeteer', () => {
        assert.ok(HelperPuppeteer);
    });

    it('should find element with text present (ignorecase)', async () => {
        const filenameExampleHtml = path.resolve(__dirname, './fixtures/test-page.html');
        // contentHtml = await fs.readFile(filenameExampleHtml, 'utf8');
        await page.setContent(contentHtml);
        // const elements = await HelperPuppeteer.
        assert.strictEqual(elements.length, 2);
    }).timeout(20000);

    it('should find text in webpage (ignorecase)', async () => {
        const url = "https://es.wikipedia.org/wiki/Wikipedia:Portada";
        let textsTofind = ["Portal de la comunidad", "MediaWiki"];

        await page.goto(url, { waitUntil: 'networkidle0' });

        for (const textTofind of textsTofind) {
            if (! await HelperPuppeteer.isTextPresentOnWebpage(page, textTofind)) {
                assert.fail("Text not found " + textTofind);
            }
        }

    }).timeout(20000);
 
});

after(async () => {
    await browser.close();
})