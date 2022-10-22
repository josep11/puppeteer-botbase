const glob = require("glob");
const os = require("os");

const { Puppeteer, Page } = require("puppeteer");
class HelperPuppeteer {
	/**
	 * Gets the location of the local puppeteer installation
	 * @throws {Error} when not found
	 * @returns {string} the path to the puppeteer installation
	 */
	static getLocalPuppeteerInstallation() {
		/**
		 *
		 * @param {string} rootDir
		 * @returns {string?} path to puppeteer installation
		 */
		function getLocalPuppeteer(rootDir) {
			const puppeteerDirnameMac =
				rootDir + "/mac-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium";
			const puppeteerDirnameLinux = rootDir + "/linux-*/chrome-linux/chrome";

			for (const puppeteerDirname of [
				puppeteerDirnameLinux,
				puppeteerDirnameMac,
			]) {
				const results = glob.sync(puppeteerDirname);
				if (results && results.length > 0) {
					return results[0];
				}
			}
			return null;
		}

		const puppeteerVersion = require("puppeteer/package.json").version;

		// 1. will try to get from the path: starting from Puppeteer 19, the binaries will NOT be downloaded to node_modules anymore but rather to the ~/.cache/puppeteer folder.
		const rootDir = os.homedir() + "/.cache/puppeteer/chrome";

		// 2. If not found trying to find for older versions of Puppeteer (< 19)
		const rootDirOld = "./node_modules/puppeteer/.local-chromium";

		let puppeteerPath = null;
		if (puppeteerVersion >= "19") {
			puppeteerPath = getLocalPuppeteer(rootDir);
		} else {
			puppeteerPath = getLocalPuppeteer(rootDirOld);
		}

		if (puppeteerPath) {
			return puppeteerPath;
		}

		throw "Puppeteer not installed";
	}

	/**
	 * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found.
	 * That's why it is recommended to set the @elementType param to narrow down the search
	 * @param {*} page Puppeteer page
	 * @param {string?} textBtnOrChildren the text to find
	 * @param {string?} elementType the element type. i.e: p, div, a, ...
	 * @returns {Promise<boolean>} true if the element was clicked, false otherwise
	 */
	static async closePopupByTextContaining(
		page,
		textBtnOrChildren = "Aceptar y cerrar",
		elementType = "*"
	) {
		const btn = await page.$x(
			`//${elementType}[contains(., "${textBtnOrChildren}")]`
		);
		let clicked = false;
		if (btn && btn.length == 0) {
			console.debug(
				`popup with text '${textBtnOrChildren}' not found ... continuing`
			);
		} else {
			try {
				await btn[0].click();
				clicked = true;
				await page.waitForTimeout(1500);
			} catch (err) {
				console.error(
					`error clicking popup button. '${textBtnOrChildren}' (element="${elementType}"). Continuing ...`
				);
			}
		}

		return clicked;
	}

	/**
	 *
	 * @param {*} page Puppeteer page
	 * @param {string?} textBtn the exact text to find
	 * @param {string?} elementType the element type. i.e: p, div, a, ...
	 * @returns {Promise<boolean>} true if the element was clicked, false otherwise
	 */
	static async closePopup(
		page,
		textBtn = "Aceptar y cerrar",
		elementType = "*"
	) {
		const btn = await page.$x(
			`//${elementType}[contains(text(), "${textBtn}")]`
		);
		let clicked = false;
		if (btn && btn.length == 0) {
			console.debug(`popup with text '${textBtn}' not found ... continuing`);
		} else {
			try {
				await btn[0].click();
				clicked = true;
				await page.waitForTimeout(1500);
			} catch (err) {
				console.error(
					`error clicking popup button. '${textBtn}' (element="${elementType}"). Continuing ...`
				);
			}
		}

		return clicked;
	}

	/**
	 * Finds texts (ignoring case) on page text
	 * @param {*} page Puppeteer Page
	 * @param {string} text Text to find
	 * @returns true or false
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
				document.scrollingElement.scrollBy(0, distance);
				if (
					document.scrollingElement.scrollTop + window.innerHeight >=
					document.scrollingElement.scrollHeight
				) {
					clearInterval(timer);
					resolve();
				}
			}, delay);
		});
	}
}

module.exports = HelperPuppeteer;
