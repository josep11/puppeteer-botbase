// eslint-disable-next-line no-unused-vars
import puppeteer, { Browser, Page } from "puppeteer";

import { HelperPuppeteer } from "../src";

jest.setTimeout(20000); // globally set timeout for all tests

let browser: Browser, page: Page;

async function initBrowser() {
  browser = await puppeteer.launch({
    // headless: false,
  });
  page = await browser.newPage();
}

async function closeBrowser() {
  await browser?.close();
}

async function reinitBrowser() {
  await closeBrowser();
  await initBrowser();
}

beforeAll(async () => {
  await initBrowser();
});

const POPUP_PAGE_URL = "https://www.bonarea.com/ca/";
const POPUP_ACCEPT_COOKIES_BUTTON_TEXT = "Acceptar";
const POPUP_ACCEPT_COOKIES_BUTTON_ELEMENT_TYPE = "button";
const POPUP_ACCEPT_COOKIES_BUTTON_CSS_SELECTOR = "#onetrust-accept-btn-handler";

/**
 * @param {Page} page Puppeteer page
 * @param {string} text text to be checked
 * @returns {Promise<boolean>} true if the text is not found, false otherwise
 */
async function verifyTextIsNotPresent(page: Page, text: string) {
  const pageContent = await page.content();
  return !pageContent.includes(text);
}

describe("Module Helper Puppeteer Tests", () => {
  it("should import helper puppeteer", () => {
    expect(HelperPuppeteer).toBeTruthy();
  });

  /* 
    it('should find element with text present (ignorecase)', async () => {
        const filenameExampleHtml = path.resolve(__dirname, './fixtures/test-page.html');
        // contentHtml = await fs.readFile(filenameExampleHtml, 'utf8');
        await page.setContent(contentHtml);
        // const elements = await HelperPuppeteer.
        assert.strictEqual(elements.length, 2);
    });
 */

  it("isTextPresentOnWebpage: should find text in webpage (ignorecase)", async () => {
    const url = "https://es.wikipedia.org/wiki/Wikipedia:Portada";
    let textsTofind = ["la enciclopedia", "Acceder", "Al usar este sitio"];

    await page.goto(url, { waitUntil: "networkidle0" });

    for (const textTofind of textsTofind) {
      if (!(await HelperPuppeteer.isTextPresentOnWebpage(page, textTofind))) {
        throw new Error("Text not found " + textTofind);
      }
    }
  });

  it("closePopup: should close popup by text: BonArea - Cookies popup", async () => {
    await reinitBrowser(); // We reinit the browser to make sure that no cookies are set for the page (it could make the tests flaky)

    await page.goto(POPUP_PAGE_URL, { waitUntil: "networkidle0" });

    const clicked = await HelperPuppeteer.closePopup(
      page,
      POPUP_ACCEPT_COOKIES_BUTTON_TEXT,
      POPUP_ACCEPT_COOKIES_BUTTON_ELEMENT_TYPE
    );

    expect(clicked).toBeTruthy();
  });

  it("tryToClickElementByTextOrCssSelectors: should click pop up button by text: BonArea - Cookies popup", async () => {
    await reinitBrowser(); // We reinit the browser to make sure that no cookies are set for the page (it could make the tests flaky)

    await page.goto(POPUP_PAGE_URL, { waitUntil: "networkidle0" });

    await HelperPuppeteer.tryToClickElementByTextOrCssSelectors(
      page,
      POPUP_ACCEPT_COOKIES_BUTTON_TEXT,
      []
    );

    // Verify that some text inside that cookies popup is not present anymore
    await assertThatCookiesTextIsNotPresent();
  });

  it("tryToClickElementByTextOrCssSelectors: should click pop up button by text: BonArea - Cookies popup", async () => {
    // We set up both a wrong text and the css selectors to fully test the method to see if it can be found also
    await reinitBrowser(); // We reinit the browser to make sure that no cookies are set for the page (it could make the tests flaky)

    await page.goto(POPUP_PAGE_URL, { waitUntil: "networkidle0" });

    const wrongText = "Acccccccccccccceptar";

    await HelperPuppeteer.tryToClickElementByTextOrCssSelectors(
      page,
      wrongText,
      [POPUP_ACCEPT_COOKIES_BUTTON_CSS_SELECTOR]
    );

    // Verify that some text inside that cookies popup is not present anymore
    await assertThatCookiesTextIsNotPresent();
  });

  /* 
	// This test is failing as there is no cookies pop up anymore. Keeping it here as a reference.

	it("closePopup: should close popup by text (in the root element)", async () => {
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
	});
	 */
});

afterAll(async () => {
  await closeBrowser();
});

async function assertThatCookiesTextIsNotPresent() {
  const textThatShouldNotBeFound = "utilitzem galetes";

  const textNotFound = await verifyTextIsNotPresent(
    page,
    textThatShouldNotBeFound
  );
  expect(textNotFound).toEqual(true);
}
