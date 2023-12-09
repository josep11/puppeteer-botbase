/* global it, describe, before, after  */
const assert = require("assert");
// Require the Puppeteer module and the built-in assert module
const puppeteer = require("puppeteer");
const { getLocalPuppeteerInstallation } = require("../helper_puppeteer");
let browser, page;

// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
	browser = await puppeteer.launch({
		// headless: false,
	});
	page = await browser.newPage();
});

const HelperPuppeteer = require("../helper_puppeteer");

describe("Module Helper Puppeteer Tests", () => {
	it("should import helper puppeteer", () => {
		assert.ok(HelperPuppeteer);
	});

	it("should find local puppeteer chromium install", () => {
		//TODO: decide if it's needed here as chromium is lazily installed and puppeteer is an optionalDependency
		assert.doesNotThrow(() => {
			getLocalPuppeteerInstallation();
		}, "Install problem: local chromium not found");
	});

	it("should find text in webpage (ignorecase)", async () => {
		const url = "https://es.wikipedia.org/wiki/Wikipedia:Portada";
		let textsTofind = ["la enciclopedia", "Acceder", "Al usar este sitio"];

		await page.goto(url, { waitUntil: "networkidle0" });

		for (const textTofind of textsTofind) {
			if (!(await HelperPuppeteer.isTextPresentOnWebpage(page, textTofind))) {
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

	/**
     * @deprecated
     
     it('should close popup by text containing (in the child elements)', async () => {
        const url = "https://blog.wishpond.com/post/94441887713/5-examples-of-website-popups-that-work";
        const elementType = "p"; //this element does not contain the desired text, only their children
        //in this example the structure is <p><a>desired text</a></p>
        const textTofind = "Later";

        await page.goto(url, { waitUntil: 'networkidle0' });

        await page.evaluate(HelperPuppeteer.scrollToBottom);

        const clicked = await HelperPuppeteer.closePopupByTextContaining(page, textTofind, elementType);
        assert.strictEqual(clicked, true);

        const clicked2 = await HelperPuppeteer.closePopupByTextContaining(page, 'random text not existing', elementType);
        assert.strictEqual(clicked2, false, 'should have returned false as ');
    }).timeout(20000);
*/

	it("should close popup by text (in the root element)", async () => {
		const url =
			"https://www.w3schools.com/bootstrap5/tryit.asp?filename=trybs_modal&stacked=h";
		const elementType = "button";
		const textTofind = "Close";

		await page.goto(url, { waitUntil: "networkidle0" });

		// First we attempt to close the Accept cookies pop up
		const popup1Clicked = await HelperPuppeteer.closePopup(
			page,
			"Accept all & visit the site",
			"*"
		);

		assert.ok(popup1Clicked);

		// select iframe
		const frameElement = await page.$("#iframeResult");
		const frame = await frameElement.contentFrame();

		assert.ok(
			frame,
			"fix the tests and the iframe was not found to open the modal"
		);

		// force open the modal
		const cssSelectorOpenModal = "body > div.container.mt-3 > button";
		const btn = await frame.$(cssSelectorOpenModal);
		if (!btn) {
			throw Error(
				"fix the tests as the button to open the modal does not exist in that page"
			);
		}

		await btn.click();

		const clicked = await HelperPuppeteer.closePopup(
			frame,
			textTofind,
			elementType
		);

		assert.ok(clicked);
	}).timeout(20000);
});

after(async () => {
	await browser.close();
});
