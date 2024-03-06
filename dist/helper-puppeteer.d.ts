import { Page } from "puppeteer";
export declare class HelperPuppeteer {
    /**
     * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found.
     * That's why it is recommended to set the @elementType param to narrow down the search
     * @param {Page} page Puppeteer page
     * @param {string?} textElementOrChildren the text to find
     * @param {string?} elementType the element type. i.e: p, div, a, ...
     * @returns {Promise<boolean>} true if the element was clicked, false otherwise
     */
    static closePopupByTextContaining(page: Page, textElementOrChildren?: string, elementType?: string): Promise<boolean>;
    /**
     * @param {Page} page Puppeteer page
     * @param {string?} elementText the exact text to find
     * @param {string?} elementType the element type. i.e: p, div, a, ...
     * @returns {Promise<boolean>} true if the element was clicked, false otherwise
     */
    static closePopup(page: Page, elementText?: string, elementType?: string): Promise<boolean>;
    /**
     * @param {Page} page Puppeteer page
     * @param {?string} elementText the text to find
     * @param {Array} cssSelectorArray
     */
    static tryToClickElementByTextOrCssSelectors(page: Page, elementText?: string | null, cssSelectorArray?: string[]): Promise<void>;
    /**
     * Checks if page contains a specific text (case sensitive by default)
     * @param {Page} page Puppeteer Page
     * @param {string} text Text to find
     * @param {boolean?} ignoreCase wether we should ignore the case or not
     * @returns {Promise<boolean>}
     */
    static isTextPresentOnWebpage(page: Page, text: string, ignoreCase?: boolean): Promise<boolean>;
    /**
     * @param {Page} page
     * @param {string} textToFind
     * @returns {Promise<Number>} count
     */
    static countStringOccurrencesInPage(page: Page, textToFind: string): Promise<number>;
    /**
     * Usage: await this.page.evaluate(HelperPuppeteer.scrollToBottom);
     */
    static scrollToBottom(): Promise<void>;
    /**
     * @param {Page} page
     * @param {string} filename
     * @returns {Promise<void>}
     */
    static dumpPageContentToFile(page: Page, filename: string): Promise<void>;
    /**
     * @param {Page} page
     * @param {string} selector
     * @param {string} text
     */
    static typeDelayed(page: Page, selector: string, text: string): Promise<void>;
}
