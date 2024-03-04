import { Page } from "puppeteer";
import { helper } from "../index";

export async function semiRandomiseViewPort(
  page: Page,
  width: number,
  height: number
) {
  await page.setViewport({
    width: width + helper.getRandBetween(1, 100),
    height: height + helper.getRandBetween(1, 100),
  });
}
