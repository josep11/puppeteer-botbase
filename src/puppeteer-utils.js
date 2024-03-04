// eslint-disable-next-line no-unused-vars
import { Page } from "puppeteer";
import { helper } from "../index.js";

/**
 * @param {Page} page Puppeteer page
 * @param {Number} width
 * @param {Number} height
 * @returns {Promise<void>}
 */
export async function semiRandomiseViewPort(page, width, height) {
  await page?.setViewport({
    width: width + helper.getRandBetween(1, 100),
    height: height + helper.getRandBetween(1, 100),
  });
}
