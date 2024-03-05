import { helper } from "./index";
import { Page } from "puppeteer";

export class HelperPuppeteer {
  /**
   * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found.
   * That's why it is recommended to set the @elementType param to narrow down the search
   * @param {Page} page Puppeteer page
   * @param {string?} textElementOrChildren the text to find
   * @param {string?} elementType the element type. i.e: p, div, a, ...
   * @returns {Promise<boolean>} true if the element was clicked, false otherwise
   */
  static async closePopupByTextContaining(
    page: Page,
    textElementOrChildren = "Aceptar y cerrar",
    elementType = "*"
  ) {
    const xPathSel = `::-p-xpath(//${elementType}[contains(., "${textElementOrChildren}")])`;
    const btn = await page.$(xPathSel);

    if (!btn) {
      console.debug(
        `popup with text '${textElementOrChildren}' not found ... continuing`
      );
      return false;
    }

    try {
      await btn.click();
      await helper.waitForTimeout(1500);
      return true;
    } catch (err: any) {
      console.error(
        `error clicking popup button. '${textElementOrChildren}' (element="${elementType}"). Continuing ...`
      );
    }

    return false;
  }

  /**
   * @param {Page} page Puppeteer page
   * @param {string?} elementText the exact text to find
   * @param {string?} elementType the element type. i.e: p, div, a, ...
   * @returns {Promise<boolean>} true if the element was clicked, false otherwise
   */
  static async closePopup(
    page: Page,
    elementText = "Aceptar y cerrar",
    elementType = "*"
  ) {
    const xPathSel = `::-p-xpath(//${elementType}[contains(text(), "${elementText}")])`;
    const btn = await page.$(xPathSel);

    if (!btn) {
      console.debug(
        `popup with text '${elementText}' not found ... continuing`
      );
      return false;
    }

    let clicked = false;
    try {
      await btn.click();
      clicked = true;
      // TODO: parametrise timeout as optional param defaulting to 1500
      await helper.waitForTimeout(1500);
    } catch (err: any) {
      console.error(
        `error clicking popup button. '${elementText}' (element="${elementType}"). Continuing ...`
      );
      console.error(err);
    }

    return clicked;
  }

  /**
   * @param {Page} page Puppeteer page
   * @param {?string} elementText the text to find
   * @param {Array} cssSelectorArray
   */
  static async tryToClickElementByTextOrCssSelectors(
    page: Page,
    elementText: string | null = null,
    cssSelectorArray: string[] = []
  ) {
    if (
      elementText &&
      (await this.closePopupByTextContaining(page, elementText))
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
   * Checks if page contains a specific text (case sensitive by default)
   * @param {Page} page Puppeteer Page
   * @param {string} text Text to find
   * @param {boolean?} ignoreCase wether we should ignore the case or not
   * @returns {Promise<boolean>}
   */
  static async isTextPresentOnWebpage(
    page: Page,
    text: string,
    ignoreCase = true
  ) {
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
  static async countStringOccurrencesInPage(page: Page, textToFind: string) {
    // TODO: fix floating promises still not being detected when missing
    return await page.$eval(
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
   * Usage: await this.page.evaluate(HelperPuppeteer.scrollToBottom);
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
  static async dumpPageContentToFile(page: Page, filename: string) {
    const content = await page.content();
    await helper.writeFile(filename, content);
  }

  /**
   * @param {Page} page
   * @param {string} selector
   * @param {string} text
   */
  static async typeDelayed(page: Page, selector: string, text: string) {
    await page.type(selector, text, {
      delay: helper.getRandBetween(10, 20),
    });
  }
}
