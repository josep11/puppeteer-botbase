import { resolve } from "path";

import { existsSync } from "fs";
import { CookieSaverInterface, helper, CookieSaver } from "../src";

let cookieSaver: CookieSaverInterface;

const cookiesFilePath = resolve("./res/cookies_test.json");

beforeAll(async () => {
  await helper.rmFileIfExists(cookiesFilePath);
});

describe("CookieSaver Tests", () => {
  it("should instantiate CookieSaver", () => {
    cookieSaver = new CookieSaver(cookiesFilePath);
    expect(cookieSaver).toBeTruthy();
  });

  it("should throw an error on constructor because of first param type style", () => {
    try {
      new CookieSaver("");
      // eslint-disable-next-line no-undef
      fail("did not throw");
    } catch (e) {
      /* empty */
    }
  });

  it("should write cookies", async () => {
    try {
      await cookieSaver.writeCookies([{ e: 1 }]);
    } catch (err: any) {
      console.error(err);
      throw new Error("exception saving cookies");
    }
    expect(existsSync(cookiesFilePath)).toEqual(true);
  });

  it("should read cookies", async () => {
    try {
      await cookieSaver.readCookies();
    } catch (e) {
      // eslint-disable-next-line no-undef
      fail("Error reading cookies: " + e);
    }
  });

  it("should remove cookies", async () => {
    try {
      await cookieSaver.removeCookies();
    } catch (e) {
      // eslint-disable-next-line no-undef
      fail("Error removing cookies: " + e);
    }
  });
});
