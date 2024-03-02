// Node.js built-in modules
import assert from 'assert';
import path from 'path';
import fs from 'fs';

// Third-party libraries
import puppeteer from 'puppeteer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = path.resolve(__dirname, '../');

// TODO: verify it's working
console.log(basePath);

// Application-specific modules
import { shouldTestBotBase } from './botbase.shared.js';
import { BotBaseFactory } from '../src/botbase-factory.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const BotBase = BotBaseFactory(puppeteer);

describe("Botbase Tests", () => {
  shouldTestBotBase({
    puppeteer,
    BotBase,
    basePath,
    cookieSaver,
    screenshotSaver,
  });

  it("should take a screenshot with puppeteer", async () => {
    const mainUrl = "https://google.com";
    const botbase = new BotBase({
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
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
