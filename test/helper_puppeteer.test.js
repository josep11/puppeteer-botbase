/* global it, describe, before, after  */
const assert = require('assert');
// Require the Puppeteer module and the built-in assert module
const puppeteer = require('puppeteer')
let browser, page

// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
    browser = await puppeteer.launch({
        // headless: false,
    })
    page = await browser.newPage()
})

const HelperPuppeteer = require('../helper_puppeteer');

describe('Module Helper Puppeteer Tests', () => {

    it('should import helper puppeteer', () => {
        assert.ok(HelperPuppeteer);
    });

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


    /* 
    it('should find element with text present (ignorecase)', async () => {
        const filenameExampleHtml = path.resolve(__dirname, './fixtures/test-page.html');
        // contentHtml = await fs.readFile(filenameExampleHtml, 'utf8');
        await page.setContent(contentHtml);
        // const elements = await HelperPuppeteer.
        assert.strictEqual(elements.length, 2);
    }).timeout(20000);
 */

    it('should close popup by text containing (in the child elements)', async () => {
        const url = "https://blog.wishpond.com/post/94441887713/5-examples-of-website-popups-that-work";
        const elementType = "p"; //this element does not contain the desired text, only their children
        //in this example the structure is <p><a>desired text</a></p>
        const textTofind = "Get Started";

        await page.goto(url, { waitUntil: 'networkidle0' });

        const clicked = await HelperPuppeteer.closePopup(page, textTofind, elementType);
        assert.strictEqual(clicked, true);

        const clicked2 = await HelperPuppeteer.closePopup(page, 'random text not existing', elementType);
        assert.strictEqual(clicked2, false, 'should have returned false as ');
    }).timeout(20000);


    it('should close popup by text containing (in the root element)', async () => {
        const url = "https://www.mailerlite.com/blog/inspiring-examples-of-email-pop-ups-and-why-they-work";
        const elementType = "button";
        const textTofind = "Accept All Cookies";

        await page.goto(url, { waitUntil: 'networkidle0' });

        const clicked = await HelperPuppeteer.closePopup(page, textTofind, elementType);

        assert.strictEqual(clicked, true);
    }).timeout(20000);

});

after(async () => {
    await browser.close();
})