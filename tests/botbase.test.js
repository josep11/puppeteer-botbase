// Node.js built-in modules
import assert from "assert";
import fs from "fs";
import path from "path";

// Third-party libraries
import puppeteer from "puppeteer";
// Application-specific modules
import { BotBase } from "../src/botbase.js";
import { shouldTestBotBase } from "./botbase.shared.js";

import { LocalFsCookieSaver } from "../src/LocalFsCookieSaver.js";
import { LocalScreenshotSaver } from "../src/LocalScreenshotSaver.js";
import { BrowserLauncher } from "../src/browser-launcher.js";
import { dirname } from "../src/utils.js";

const __dirname = dirname(import.meta.url);
const basePath = path.resolve(__dirname, "../");

const browserLauncher = new BrowserLauncher(puppeteer);

const cookieSaver = new LocalFsCookieSaver({
  cookiesFilePath: path.resolve(basePath, "./res/cookies.json"),
});
const screenshotSaver = new LocalScreenshotSaver({
  screenshotBasepath: path.resolve(basePath, "./screenshots"),
});

describe("Botbase Tests", () => {
  shouldTestBotBase({
    BotBase,
    basePath,
    cookieSaver,
    screenshotSaver,
    browserLauncher,
  });

  it("should take a screenshot with puppeteer", async () => {
    const mainUrl = "https://google.com";
    const botbase = new BotBase({
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
      browserLauncher,
    });
    let screenshotPath;
    await botbase.initialize();
    await botbase.page?.goto(mainUrl, { waitUntil: "networkidle2" });
    try {
      screenshotPath = await botbase.takeScreenshot("tests");
      assert.equal(typeof screenshotPath, "string");
    } catch (err) {
      console.error(err);
      assert.fail("screenshot not successful");
    }

    try {
      fs.statSync(screenshotPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        assert.fail(`The file "${screenshotPath}" does not exist`);
      } else {
        throw err;
      }
    }
  });
});
