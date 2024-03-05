import assert from "assert";
import path from "path";

import fs from "fs";
import { CookieSaverInterface } from "../src/savers/cookie-saver-interface";
import { helper } from "../src/helper";
import { CookieSaver } from "../src/savers/cookie-saver";

let cookieSaver: CookieSaverInterface;

const cookiesFilePath = path.resolve("./res/cookies_test.json");

beforeAll(async () => {
  await helper.rmFileIfExists(cookiesFilePath);
});

describe("LocalFsCookieSaver Tests", () => {
  it("should intantiate LocalFsCookieSaver", () => {
    cookieSaver = new CookieSaver(cookiesFilePath);
    assert.ok(cookieSaver);
  });

  it("should throw an error on constructor because of first param type style", () => {
    assert.throws(() => {
      new CookieSaver("");
    }, "constructor param is not there");
  });

  it("should write cookies", async () => {
    try {
      await cookieSaver.writeCookies([{ e: 1 }]);
    } catch (err: any) {
      console.error(err);
      assert.fail("exception saving cookies");
    }

    assert.strictEqual(fs.existsSync(cookiesFilePath), true);
  });

  it("should read cookies", () => {
    assert.doesNotThrow(async () => {
      await cookieSaver.readCookies();
    });
  });

  it("should read cookies", () => {
    // TODO: doesNotThrow, I think it does not throw but has some unexpected behaviors
    assert.doesNotThrow(async () => {
      await cookieSaver.removeCookies();
    });
  });
});
