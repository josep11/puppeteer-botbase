const { Page } = require("puppeteer");
const { waitForTimeout, writeFile, getRandBetween } = require("./helper");
class HelperPuppeteer {
	/**
	 * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found.
	 * That's why it is recommended to set the @elementType param to narrow down the search
	 * @param {Page} page Puppeteer page
	 * @param {string?} textElementOrChildren the text to find
	 * @param {string?} elementType the element type. i.e: p, div, a, ...
	 * @returns {Promise<boolean>} true if the element was clicked, false otherwise
	 */
	static async closePopupByTextContaining(
		page,
		textElementOrChildren = "Aceptar y cerrar",
		elementType = "*"
	) {
		const btn = await page.$x(
			`//${elementType}[contains(., "${textElementOrChildren}")]`
		);

		if (btn && btn.length == 0) {
			console.debug(
				`popup with text '${textElementOrChildren}' not found ... continuing`
			);
			return false;
		}

		try {
			await btn[0].click();
			await waitForTimeout(1500);
			return true;
		} catch (err) {
			console.error(
				`error clicking popup button. '${textElementOrChildren}' (element="${elementType}"). Continuing ...`
			);
		}

		return false;
	}

	/**
	 * @param {Page} page Puppeteer page
	 * @param {string?} textBtn the exact text to find
	 * @param {string?} elementType the element type. i.e: p, div, a, ...
	 * @returns {Promise<boolean>} true if the element was clicked, false otherwise
	 */
	static async closePopup(
		page,
		textBtn = "Aceptar y cerrar",
		elementType = "*"
	) {
		const xPathSel = `::-p-xpath(//${elementType}[contains(text(), "${textBtn}")])`;
		const btn = await page.$(xPathSel);

		if (!btn) {
			console.debug(`popup with text '${textBtn}' not found ... continuing`);
			return false;
		}

		let clicked = false;
		try {
			await btn.click();
			clicked = true;
			// TODO: parametrise timeout as optional param defaulting to 1500
			await waitForTimeout(1500);
		} catch (err) {
			console.error(
				`error clicking popup button. '${textBtn}' (element="${elementType}"). Continuing ...`
			);
			console.error(err);
		}

		return clicked;
	}

	/**
	 *
	 * @param {Page} page Puppeteer page
	 * @param {string?} textElementOrChildren the text to find
	 * @param {Array} cssSelectorArray
	 */
	static async tryToClickElementByTextOrCssSelectors(
		page,
		textElementOrChildren = null,
		cssSelectorArray = []
	) {
		if (
			textElementOrChildren &&
			(await this.closePopupByTextContaining(page, textElementOrChildren))
		) {
			return;
		}

		for (const cssSelector of cssSelectorArray) {
			const btn = await page.$(cssSelector);
			if (btn) {
				await btn.click();
				return;
			}
			await page.evaluate((cssSelector) => {
				const btn = document.querySelector(cssSelector);
				if (btn) {
					// @ts-ignore
					btn.click();
				}
			}, cssSelector);
		}
	}

	/**
	 * Finds texts (ignoring case) on page text
	 * @param {Page} page Puppeteer Page
	 * @param {string} text Text to find
	 * @returns {Promise<boolean>}
	 */
	static async isTextPresentOnWebpage(page, text, ignoreCase = true) {
		const options = ignoreCase ? "gi" : "g";
		const innerText = await page.evaluate(() => document.body.innerText);
		const regex = new RegExp(text, options);
		if (regex.test(innerText)) {
			return true;
		}
		console.error(
			`Text "${text}" is not found in document body on ${page.url()}`
		);
		return false;
	}

	/**
	 * @param {Page} page
	 * @param {string} textToFind
	 * @returns {Promise<Number>} count
	 */
	static async countStringOccurrencesInPage(page, textToFind) {
		return page.$eval(
			"body",
			(el, textSearch) => {
				let text = el.innerText;
				const re = new RegExp(textSearch, "gi");
				return (text.match(re) || []).length;
			},
			textToFind
		);
	}

	/**
	 * Usage:
	 * await this.page.evaluate(HelperPuppeteer.scrollToBottom);
	 */
	static async scrollToBottom() {
		//Will be evaluated in browser context, so constant goes here
		const DISTANCE_SCROLL = Math.floor(Math.random() * (100 - 65 + 1)) + 65; //pseudo randomising distance_scroll bw 65 and 100
		await new Promise((resolve) => {
			const distance = DISTANCE_SCROLL; // should be less than or equal to window.innerHeight
			const delay = 100;
			const timer = setInterval(() => {
				// @ts-ignore
				document.scrollingElement.scrollBy(0, distance);
				if (
					// @ts-ignore
					document.scrollingElement.scrollTop + window.innerHeight >=
					// @ts-ignore
					document.scrollingElement.scrollHeight
				) {
					clearInterval(timer);
					resolve(true);
				}
			}, delay);
		});
	}

	/**
	 * @param {Page} page
	 * @param {string} filename
	 * @returns {Promise<void>}
	 */
	static async dumpPageContentToFile(page, filename) {
		const content = await page.content();
		await writeFile(filename, content);
	}

	/**
	 *
	 * @param {Page} page
	 * @param {string} selector
	 * @param {string} text
	 */
	static async typeDelayed(page, selector, text) {
		await page.type(selector, text, {
			delay: getRandBetween(10, 20),
		});
	}
}

module.exports = HelperPuppeteer;
