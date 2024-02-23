const assert = require("assert");
// Require the Puppeteer module and the built-in assert module
const puppeteer = require("puppeteer");
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
