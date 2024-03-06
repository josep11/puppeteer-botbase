import { CookieParam, Page } from "puppeteer";
import { helper } from "./index";

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

export function objectToCookieParam(obj: object): CookieParam {
  const newObj = obj as Partial<CookieParam>;

  // The name and value properties are mandatory
  if (!newObj.name || !newObj.value) {
    throw new Error("Missing mandatory properties");
  }

  // If all properties are present, cast to CookieParam and return
  return newObj as CookieParam;
}

export function objectArrayToCookieParamArray(
  cookies: object[]
): CookieParam[] {
  const cookiesValidated = [];
  for (const cookie of cookies) {
    cookiesValidated.push(objectToCookieParam(cookie));
  }
  return cookiesValidated;
}
