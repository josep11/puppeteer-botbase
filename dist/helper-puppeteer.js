"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperPuppeteer = void 0;
const index_1 = require("./index");
class HelperPuppeteer {
    /**
     * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found.
     * That's why it is recommended to set the @elementType param to narrow down the search
     * @param {Page} page Puppeteer page
     * @param {string?} textElementOrChildren the text to find
     * @param {string?} elementType the element type. i.e: p, div, a, ...
     * @returns {Promise<boolean>} true if the element was clicked, false otherwise
     */
    static closePopupByTextContaining(page, textElementOrChildren = "Aceptar y cerrar", elementType = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            const xPathSel = `::-p-xpath(//${elementType}[contains(., "${textElementOrChildren}")])`;
            const btn = yield page.$(xPathSel);
            if (!btn) {
                console.debug(`popup with text '${textElementOrChildren}' not found ... continuing`);
                return false;
            }
            try {
                yield btn.click();
                yield index_1.helper.waitForTimeout(1500);
                return true;
            }
            catch (err) {
                console.error(`error clicking popup button. '${textElementOrChildren}' (element="${elementType}"). Continuing ...`);
            }
            return false;
        });
    }
    /**
     * @param {Page} page Puppeteer page
     * @param {string?} elementText the exact text to find
     * @param {string?} elementType the element type. i.e: p, div, a, ...
     * @returns {Promise<boolean>} true if the element was clicked, false otherwise
     */
    static closePopup(page, elementText = "Aceptar y cerrar", elementType = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            const xPathSel = `::-p-xpath(//${elementType}[contains(text(), "${elementText}")])`;
            const btn = yield page.$(xPathSel);
            if (!btn) {
                console.debug(`popup with text '${elementText}' not found ... continuing`);
                return false;
            }
            let clicked = false;
            try {
                yield btn.click();
                clicked = true;
                // TODO: parametrise timeout as optional param defaulting to 1500
                yield index_1.helper.waitForTimeout(1500);
            }
            catch (err) {
                console.error(`error clicking popup button. '${elementText}' (element="${elementType}"). Continuing ...`);
                console.error(err);
            }
            return clicked;
        });
    }
    /**
     * @param {Page} page Puppeteer page
     * @param {?string} elementText the text to find
     * @param {Array} cssSelectorArray
     */
    static tryToClickElementByTextOrCssSelectors(page, elementText = null, cssSelectorArray = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (elementText &&
                (yield this.closePopupByTextContaining(page, elementText))) {
                return;
            }
            for (const cssSelector of cssSelectorArray) {
                const btn = yield page.$(cssSelector);
                if (btn) {
                    yield btn.click();
                    return;
                }
                yield page.evaluate((cssSelector) => {
                    const btn = document.querySelector(cssSelector);
                    if (btn) {
                        // @ts-ignore
                        btn.click();
                    }
                }, cssSelector);
            }
        });
    }
    /**
     * Checks if page contains a specific text (case sensitive by default)
     * @param {Page} page Puppeteer Page
     * @param {string} text Text to find
     * @param {boolean?} ignoreCase wether we should ignore the case or not
     * @returns {Promise<boolean>}
     */
    static isTextPresentOnWebpage(page, text, ignoreCase = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = ignoreCase ? "gi" : "g";
            const innerText = yield page.evaluate(() => document.body.innerText);
            const regex = new RegExp(text, options);
            if (regex.test(innerText)) {
                return true;
            }
            console.error(`Text "${text}" is not found in document body on ${page.url()}`);
            return false;
        });
    }
    /**
     * @param {Page} page
     * @param {string} textToFind
     * @returns {Promise<Number>} count
     */
    static countStringOccurrencesInPage(page, textToFind) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: fix floating promises still not being detected when missing
            return yield page.$eval("body", (el, textSearch) => {
                let text = el.innerText;
                const re = new RegExp(textSearch, "gi");
                return (text.match(re) || []).length;
            }, textToFind);
        });
    }
    /**
     * Usage: await this.page.evaluate(HelperPuppeteer.scrollToBottom);
     */
    static scrollToBottom() {
        return __awaiter(this, void 0, void 0, function* () {
            //Will be evaluated in browser context, so constant goes here
            const DISTANCE_SCROLL = Math.floor(Math.random() * (100 - 65 + 1)) + 65; //pseudo randomising distance_scroll bw 65 and 100
            yield new Promise((resolve) => {
                const distance = DISTANCE_SCROLL; // should be less than or equal to window.innerHeight
                const delay = 100;
                const timer = setInterval(() => {
                    // @ts-ignore
                    document.scrollingElement.scrollBy(0, distance);
                    if (
                    // @ts-ignore
                    document.scrollingElement.scrollTop + window.innerHeight >=
                        // @ts-ignore
                        document.scrollingElement.scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, delay);
            });
        });
    }
    /**
     * @param {Page} page
     * @param {string} filename
     * @returns {Promise<void>}
     */
    static dumpPageContentToFile(page, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield page.content();
            yield index_1.helper.writeFile(filename, content);
        });
    }
    /**
     * @param {Page} page
     * @param {string} selector
     * @param {string} text
     */
    static typeDelayed(page, selector, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.type(selector, text, {
                delay: index_1.helper.getRandBetween(10, 20),
            });
        });
    }
}
exports.HelperPuppeteer = HelperPuppeteer;
